import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'deposit-serial',
    templateUrl: 'deposit-serial.component.html'
})
export class DepositSerialComponent implements OnInit{

    /**跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();
    /**回上一頁 事件 */
    @Output() goBackEmit = new EventEmitter();
    public bankData ={};
    /**
     * 輸入金額
     */
    public inputGold : number = null;
    /**
     * 輸入流水號
     */
    public inputSerial : number;
    /**輸入金額欄位 控制器 ts*/
    public inputGoldControl = new FormControl();
    /**輸入流水號欄位控制器 訂閱 ts*/
    private inputGoldControlSub = new Subscription();
    /**
     * 輸入金額 錯誤訊息
     */
    public erroMsg : string = "";
    constructor(public globals: GlobalService, public api: ApiService) { }

    ngOnInit() { 
        this.inputGoldControlSub = this.inputGoldControl.valueChanges.subscribe((inputGold) => {
                this.erroMsg = '';
                if(inputGold == null){
                    return;
                }
                if(inputGold < 100) { 
                    this.erroMsg = "单笔存款金额100元 ~ 50,000元"  //*單筆存款金額最低100元
                }else if(new RegExp("[\\d]+\\.").test(inputGold)){
                    this.erroMsg = "单笔存款金额请输入整数";
                }else if(inputGold > 50000){
                    this.erroMsg = "单笔存款金额100元 ~ 50,000元";
                }
        });
        this.getMemberData(this.globals.getNowUid());
    }
    /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData(_uid:string):void{
        this.api.postServer(960, { uid: _uid }).subscribe(res => {
            if(!res.err){
                console.log("deposit-serial->會員資料",res);
                return;
            }
            //設定會員資料
            let memberData = res.ret;
            let  bankInfo = memberData.info.depositbankinfo[0];
            //判定如果為 "" 或  null(undefined)  存款銀行資料
            if(memberData.info.depositbankinfo.length != 1 || 
               !bankInfo.code || !bankInfo.bankaccount || !bankInfo.bank || !bankInfo.bankname ||
                //    !bankInfo.email || 
                bankInfo.code == null || bankInfo.bankaccount == null || bankInfo.bank == null || bankInfo.banksubacc == null ||
                bankInfo.bankname == null || bankInfo.email == null){
                console.log("deposit-serial->會員資料->存款銀行資料",res);
                this.bankData = {};
                return;
            }
            this.bankData = bankInfo;
        });
    }
    /**
     *  填入正確資訊後  呼叫 760 gateway
     */
    doSerial() : any {
        let para = { uid : this.globals.getNowUid(), gold : this.inputGold, sn : this.inputSerial, backcode : this.bankData['code'] };
        // console.log(this.bankData,para);
        this.inputGold = null;
        this.inputSerial = null;
        this.api.postServer(760, para ).subscribe(res => {
            if(!res.err){
                console.log("存款回傳訊息",res);
                return;
            } 
            this.dialogEmit.emit({type: 'list', title : "申请成功", data : [['银行名称',res.ret['bankname']],['银行帐号',res.ret['bankaccount']],['申请单号',res.ret['depositNo']]]});
        });
    }
    goBack(){
        this.goBackEmit.emit({});
    }
    ngOnDestroy() {
        this.inputGoldControlSub.unsubscribe();
    }
}