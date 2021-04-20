import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { GlobalService, ApiService,ValidationService } from 'service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'user-data',
    templateUrl: 'user-data.component.html'
})
export class UserDataComponent  implements OnInit, OnDestroy {
    /**
     * 修改選項的基本資料
     */
    public info : any;
    /**
	 * 帳號
	 */
    public username: string = '';
    /**
     *帳戶餘額
     */
    public surplus: string = "0";
    /**
     * 今日交易金額
     */
    public nowCredit : string = "";
    /**
     * 今天日交易比數
     */
    public tradeCount : string = "";
    /**
     * 金額資訊訂閱
     */
    private moneyInfoSub: Subscription;
    userForm: FormGroup;
    constructor(public fb: FormBuilder,public globals: GlobalService, public api: ApiService) {
        
    }
    ngOnInit() {
        this.info = {
            phone : {
                        name : "Phone",
                        toggle : false,
                        data : ""
                    },
            email : {
                        name : "Email",
                        toggle : false,
                        data : " "
                    },
            QQ : {
                        name : "QQ",
                        toggle : false,
                        data : " "
                    },
            WeChat : {
                        name : "Wechat",
                        toggle : false,
                        data : " "
                    },
            password: {
                        name : "Password",
                        toggle : false,
                        data : ""
            }   
        }
        /**
         * 金額資訊訂閱 更新此處  個人資料、 帳戶餘額、下注視窗 也會更新 
         */
        this.moneyInfoSub = this.globals.moneyInfo$.subscribe((res) => {
            this.surplus = res["surplus"];
            this.username =  res["username"];
            this.tradeCount = res["count"];
            // this.info.phone['phoneVerification'] = res["phoneVerification"];
		});

        this.createForm();
        this.getMemberData(this.globals.getNowUid());

     }
     /**
      *  設定 formControlName 與 Validators
      */
    createForm() {
        this.userForm = this.fb.group(
            {
            //                                                         Validators.pattern(/^[09]{2}[0-9]{8}$/)
            phone : ['', [Validators.required, Validators.minLength(5),Validators.pattern(/[0-9]{8,}$/)]],
            email : ['', [Validators.required,  Validators.pattern(/^(\w+)@([\w]+\.+[\w]+)/)]],
            QQ : ['', [Validators.required,  Validators.pattern(/[\w-]+/)]],
            WeChat : ['', [Validators.required, Validators.pattern(/[\w-]+/)]],
            oldPassword : ['', [Validators.required, ValidationService.passwordValidator]],
            newPassword : ['', [Validators.required, ValidationService.passwordValidator]],
            confirmPassword : ['', [Validators.required, ValidationService.passwordValidator]],
        },{
            //Validators.compose   multiple validators
             validator:Validators.compose([ValidationService.checkPasswords('oldPassword','newPassword'),ValidationService.matchingPasswords('newPassword', 'confirmPassword')])
        });
  }

    /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData(_uid:string):void{
        this.api.postServer(960, { uid: _uid }).subscribe(res => {
            if(!res.err){
                console.log("user-data->會員資料",res);
                return;
            }
            // //設定會員資料
            let memberData = res.ret;
            this.info.phone['data'] = memberData.info.phone != undefined ? memberData.info.phone : "";
            this.info.email['data'] = memberData.info.email != undefined ? memberData.info.email : "";
            this.info.QQ['data'] = memberData.info.QQ != undefined ? memberData.info.QQ : "";
            this.info.WeChat['data'] = memberData.info.WeChat != undefined ? memberData.info.WeChat : "";

            // this.info.phone['phoneVerification'] = memberData.info.phoneVerification != undefined ? memberData.info.phoneVerification : "";

            // memberData['phoneVerification'] = memberData.info.phoneVerification;
            //第一次先取得會員資料，把資料丟入串流 讓logout form 帳戶餘額一致
            this.globals.moneyInfoBridge(memberData);

        });
    }
    /**
     * 更新 金額
     */
    updateMoneyInfo(){
         this.api.postServer(965, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("user-data->更新金額",res);
                return;
            }
            let moneyData = res.ret;
            this.globals.moneyInfoBridge(moneyData);
        });
    }
    /**
     * 
     * @param _key  
     */
    changeToggle(_key : string){
        this.info[_key].toggle = !this.info[_key].toggle;
    }
    /**
     *  update info or password
     */
    changeInfo(_key : string){
        this.changeToggle(_key);
        if(_key == "password" ){
            this.api.postServer(920, { uid: this.globals.getNowUid(), opw: this.userForm.get("oldPassword").value, npw: this.userForm.get("newPassword").value })
                    .subscribe(res => {

                if(!res.err){
                    console.log("user-data->更改密碼",res);
                    let temp = {
                                    oldPassword : "",
                                    newPassword : "",
                                    confirmPassword : ""
                                };
                    this.userForm.patchValue(temp);
                    return;
                }
                if(location.search.indexOf("?") > -1){
                    location.href = "index.html?" + this.globals.getNowLang();
                    return;
                }
                localStorage.clear();
                sessionStorage.removeItem('uid');
                sessionStorage.removeItem('username');
                location.reload();
                return;
            });
        }else{
            const value = this.userForm.get(_key).value;
            this.info[_key]['data'] = value;
            let _data = { uid: this.globals.getNowUid(), phone: this.info.phone['data'], email: this.info.email['data'], QQ: this.info.QQ['data'], WeChat: this.info.WeChat['data']}
            this.api.postServer(925, _data ).subscribe(res => {
                if(!res.err){
                    console.log("user-data->更改會員資訊",res);
                    return;
                }
                let temp = {};
                temp[_key]="";
                this.userForm.patchValue(temp);
            });
        }
        this.getMemberData(this.globals.getNowUid());
    }
    DoVerification(){
        this.api.postServer(915, { uid: this.globals.getNowUid()}).subscribe(res => {
            if(!res.err){
                return;
            }
            alert("贵宾您好，系统已将验证码讯息传送至您的手机，请贵宾收到验证码后，发送至<STG官方微信号>，将有专员为您服务。");
        });
    }
    ngOnDestroy(){
        this.moneyInfoSub.unsubscribe();
    }
}




// https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2
// http://stackoverflow.com/posts/41139110/edit
// http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
// https://embed.plnkr.co/ukwCXm/

//https://coryrylan.com/blog/angular-form-builder-and-validation-management