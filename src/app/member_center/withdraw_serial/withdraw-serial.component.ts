import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { getLangPipe } from '../../app.pipes';
@Component({
    selector: 'withdraw-serial',
    templateUrl: 'withdraw-serial.component.html'
})
export class WithdrawSerialComponent implements OnInit, OnDestroy{
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
    constructor(public globals: GlobalService, public api: ApiService,private LangPipe:getLangPipe) { }

    memberData:any;
         /**安全馬 */
         safety : string;
    ngOnInit() {
        this.getMemberData(this.globals.getNowUid());
        this.inputControl();
    }

    /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData(_uid:string):void{
        this.api.postServer(960, { uid: _uid }).subscribe(res => {
            if(!res.err){
                console.log("withdraw->會員資料",res);
                return;
            }
            //設定會員資料
            let memberData = res.ret;
            this.memberData = res.ret;
            this.memberSurplus = memberData.surplus;
            let tempData = this.getActiveBank(memberData.info.membanklist);
            if(tempData == undefined ){
                this.dialogEmit.emit({type: 'text', title : this.LangPipe.transform('Precautions',this.api.langPackage,undefined), data : this.LangPipe.transform('Please bind the withdrawal card first',this.api.langPackage,undefined)});
                console.log("withdraw->會員資料->取得提款資料",res);
                this.bankData = {};
                this.changePage_membercenter(['membercenter','bankCard']);
                return;
            }
            this.bankData = tempData;
            // if(memberData.info.phoneVerification != 1 ){
            //     this.dialogEmit.emit({type: 'text', title : "注意事项", data : "请先认证手机"});
            //     this.changePage_membercenter(['membercenter','userData']);
            //     return;
            // }
            // this.bankData = {
            //     mbank : "三商銀行",
            //     mbname : "test",
            //     mbaccount : "123456"
            // };
        });
    }
    doWithdraw() : void{
        let para = { uid : this.globals.getNowUid(), gold : this.inputGold, bankac : this.bankData['mbaccount'], bankname  : this.bankData['mbank'], remark : "",wsecurity:this.safety};
        this.selectedValue = "";
        this.inputGold = null;
        // this.account = "";
        // this.accountName = "";
        this.api.postServer(762, para ).subscribe(res => {
            if(!res.err){
                console.log("提款回傳訊息",res);
                return;
            } 
            this.updateMoneyInfo();
            this.dialogEmit.emit({type: 'list', title : "申请成功", data : [['申请单号',res.ret['withdrawalNo']]]});
        });
    }

    inputControl() {
        this.inputGoldControlSub = this.inputGoldControl.valueChanges.subscribe((inputGold) => {
                this.erroMsg = '';
                if(inputGold == null){
                    return;
                }
                if(inputGold < 1) {
                     this.erroMsg = "提款金额最低1元";
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
    /**
     * 取得當前提款啟用的帳號
     * @param _sourceData 
     */
    getActiveBank(_sourceData) : Object{
    // console.log(_sourceData);
        for(let key in _sourceData){
            let data = _sourceData[key];
            if(data['enable'] == 'Y' ){
                return data;
            }
        }
        return;
    }
    changePage_membercenter(name: string[]) {
        let aa = new Date();
        name[1] = name[1]+"?"+aa.getTime(); 
	    this.globals.goPage(name);
    }
    goBack(){
        this.goBackEmit.emit({});
    }
    ngOnDestroy() {
        this.inputGoldControlSub.unsubscribe();
    }
}