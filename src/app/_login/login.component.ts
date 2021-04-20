import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { Observable,Subscription } from 'rxjs';
import { getLangPipe } from '../app.pipes';

import { QQid ,p_id ,c_url} from 'lib/config';


@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
/**
 * 主頁header 呼叫  登入 登出 的form
 */
export class LoginComponent implements OnInit, OnDestroy {
    /**
     * 傳值給 HeaderComponent 的 html 
     */
    @Output() headerBackTime = new EventEmitter();
    /**
     * 預設更新時間
     */
    private defaultUpdateTime : number = 30;
    /** 
     * 當前秒數 
     */
    private backTime : number = this.defaultUpdateTime;
    /**
	 * 帳號
	 */
    public username: string = '';
	/**
	 * 密碼
	 */
    public password: string = '';
    /**
     *  isRemember: html checkbox
     */
    public isRemember: boolean = false;
    /**
     *帳戶餘額
     */
    public surplus: string = "0";
    private moneyInfoSub: Subscription;
    reloadVAL=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','8'];

    reloadKEY=[];
    reloadCaptcha='';
    P_ID=p_id;


    constructor(public globals: GlobalService, 
        public api: ApiService,
        private LangPipe:getLangPipe,
       ) { 

        }

    ngOnInit() {
       // this.reload();
        /**
         * showLogin = false 代表是已登入 只是刷新頁面
         * 更新帳戶餘額
         * 更新跑馬燈
         */
        if (this.globals.getShowLogin()) return;
        this.getMemberData(this.globals.getNowUid());
        this.changePage(['gametable',this.globals.getDefaultBallType()]);
        this.globals.backTimeSub = Observable.interval(1000).subscribe( () => {
            if(this.backTime == 0 ){
                this.backTime = this.defaultUpdateTime;
                this.updateMoneyInfo(); 
                this.headerBackTime.emit("reload getMarquee");
            }
            // console.log("money",this.backTime);
            this.backTime--;
        });
        this.moneyInfoSub = this.globals.moneyInfo$.subscribe(( res : any ) => {
            this.surplus = res.surplus;
            switch(this.globals.getIsIchat()){
                case false:
                    this.username =  res.username;
                    break;
                case true:
                    this.username = this.globals.getIchatUser();
                    break;
            }
            
        });
        
    }
    /**
     * 登入 :
     *       1.驗證帳號密碼
     *       2.存入Storage
     *       3.取得會員資料
     */
    login() {
        if(this.username.trim() == "" || this.password.trim() == ""){
            alert(this.LangPipe.transform('Please enter the complete account password',this.api.langPackage,undefined));
            return;
        }
        // if(this.reloadCaptcha != this.reloadKEY.join('')){
        //     alert('验证码错误');
        //     return;
        // }
        this.api.postServer(999, { un: this.username, pw: this.password }).subscribe(res => {
            if(!res.err){
                console.log("登入",res);
                return;
            } 
            let data = res.ret;
            if(data.uid){
                if(location.search.indexOf("?") > -1 && location.search.indexOf("?user_key") == -1){
                    location.href = location.href.replace("?"+this.globals.getNowLang(),"?"+this.globals.getNowLang()+"?"+data.uid);
                    return;
                }

                sessionStorage.setItem('uid', data.uid);
                sessionStorage.setItem('username', this.username);
                sessionStorage.setItem('token', data.token);
                this.globals.setShowLogin(false);

                // 首頁登入的會員才顯示登出鍵
                sessionStorage.setItem("Logout",'Y');
                this.globals.setShowLogout(true);
                
                this.changeIsRemember();
                //防止NETWORK 留著gateway 999資料
               location.reload();
            }
        });
    }
    reload(){
       this.reloadKEY[0] = this.reloadVAL[Math.floor(Math.random()*26)];
       this.reloadKEY[1] = this.reloadVAL[Math.floor(Math.random()*26)];
       this.reloadKEY[2] = this.reloadVAL[Math.floor(Math.random()*26)];
       this.reloadKEY[3] = this.reloadVAL[Math.floor(Math.random()*26)];
       console.log(this.reloadKEY.join(''));
    }
    /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData(_uid:string):void{
        this.api.postServer(960, { uid: _uid }).subscribe(res => {
            if(!res.err){
                console.log("login->會員資料",res);
                return;
            } 
            //設定會員資料
             let memberData = res.ret;
             this.globals.setDepositUrl(memberData.memFullPayUrl);
            //第一次先取得會員資料，把資料丟入串流 讓會員中心的個人資料也會更新
            this.globals.moneyInfoBridge(memberData);
        });
    }
    /**
     * 更新 金額資訊
     */
    updateMoneyInfo(){
         this.api.postServer(965, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("login->更新金額",res);                            
                return;
            } 
            let moneyData = res.ret;
            this.globals.moneyInfoBridge(moneyData);
        });
    }
    /**
     *  登出
     */
    logout() {
        this.api.postServer(990, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("登出",res);
                return;
            }
            if(location.search.indexOf("?") > -1){
                location.href = "index.html?" + this.globals.getNowLang();
                return;
            }

            // sessionStorage.clear();		//清空sessionStorage
            sessionStorage.removeItem('uid');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('Logout');
            this.globals.backTimeSub.unsubscribe();
            this.doRememberUserData();
            this.changePage(['main']);
		    this.globals.setShowLogin(true);
        });

    }
    QQalert(){
        alert(this.LangPipe.transform('Please add customer service QQ account',this.api.langPackage,undefined)+ QQid);
    }
    openCS(){
        window.open(c_url);
    }
    changePage(name: string[]) {
	    this.globals.goPage(name);
	}
    changePage_membercenter(name: string[]) {

        if(name[0] == 'membercenter' && sessionStorage.token != 'notoken'){
            //  window.open(
            //     sessionStorage.token, this.LangPipe.transform('Personal info',this.api.langPackage,undefined)
            // );
            this.globals.setToken(true);
            return;
        }
        let aa = new Date();
        name[1] = name[1]+"?"+aa.getTime(); 
	    this.globals.goPage(name);
	}

    /**
     * 判斷 之前是否有記住帳密
     */
    doRememberUserData():void {
        let remUser = localStorage.getItem('username');
        let remPw = localStorage.getItem('password');
        if (remUser && remPw) {
            this.isRemember = true;
            this.username = remUser;
            this.password = remPw;
            return;
        }
        this.username = "";
        this.password = "";
    }
    /**
     * 
     */
    changeIsRemember(){
        if (this.isRemember) {
            localStorage.setItem('username', this.username);
            localStorage.setItem('password', this.password);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
    }
    ngOnDestroy(){
        this.moneyInfoSub.unsubscribe();
    }
    
    getOnlineCuBtln(){
        if(location.host=="big58-web.sog88.net" || location.host=="w1.125588.net" || location.host=="w1.125599.net" || location.host=="localhost:8080"){
            return true;
        }else{
            return false;
        }
            
    }
    showChatlink(){
        window.open('/app2/chatlink.html');
    }
}