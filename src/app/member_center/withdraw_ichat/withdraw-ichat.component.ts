import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'withdraw-ichat',
    templateUrl: 'withdraw-ichat.component.html'
})
export class WithdrawIchatComponent implements OnInit, OnDestroy{

    /**跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();
    /**回上一頁 事件 */
    @Output() goBackEmit = new EventEmitter();
    public selectedValue :string = "";
    public bankData ={};
    public inputGold : number ;
    /**下注欄位 控制器 ts*/
    public inputGoldControl = new FormControl();
    /**下注欄位控制器 訂閱 ts*/
    private inputGoldControlSub = new Subscription();
    public memberSurplus : number;
    public erroMsg : string = "";
    constructor(public globals: GlobalService, public api: ApiService) { }

    ngOnInit() {
        this.updateMoneyInfo();
        this.inputControl();
    }
    // doWithdraw() : void{
    //     let para = { uid : this.globals.getNowUid(), gold : this.inputGold, bankac : this.bankData['mbaccount'], bankname  : this.bankData['mbank'], remark : ""};
    //     this.selectedValue = "";
    //     this.inputGold = null;
    //     // this.account = "";
    //     // this.accountName = "";
    //     this.api.postServer(762, para ).subscribe(res => {
    //         if(!res.err){
    //             console.log("提款回傳訊息",res);
    //             return;
    //         } 
    //         this.updateMoneyInfo();
    //         this.dialogEmit.emit({type: 'list', title : "申请成功", data : [['申请单号',res.ret['withdrawalNo']]]});
    //     });
    // }
/**
     * [type] => (0:存款 1:提款)
     */
    doIchatOut(){
        let para = { uid: this.globals.getNowUid() ,cash: this.inputGold,type: 1};
        this.inputGold = null;
        this.api.postServer(763, para ).subscribe(res => {
            if(!res.err){
                console.log("login->更新金額",res);                            
                return;
            } 
            console.log(res);
            // let moneyData = res.ret;
            this.updateMoneyInfo();
            this.dialogEmit.emit({type: '', title : "成功转入ichat", data :""});
        });
    }
    inputControl() {
        this.inputGoldControlSub = this.inputGoldControl.valueChanges.subscribe((inputGold) => {
                this.erroMsg = '';
                if(inputGold == null){
                    return;
                }
                if(inputGold < 100) {
                     this.erroMsg = "提款金额最低100元";
                }else if(new RegExp("[\\d]+\\.").test(inputGold)){
                    this.erroMsg = "单笔提款金额请输入整数";
                }else if(inputGold > this.memberSurplus) {
                    this.erroMsg = "提款金额超过帐户余额"; //*提款金額超過帳戶餘額
                } 
        });
    }
    /**
     * 更新 金額
     */
    updateMoneyInfo(){
         this.api.postServer(965, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("withdraw->更新金額",res);
                return;
            } 
            let moneyData = res.ret;
            this.globals.moneyInfoBridge(moneyData);
        });
    }
    goBack(){
        this.goBackEmit.emit({});
    }
    ngOnDestroy() {
        this.inputGoldControlSub.unsubscribe();
    }
}