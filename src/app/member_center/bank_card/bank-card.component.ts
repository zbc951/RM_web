import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';


@Component({
    selector: 'bank-card',
    templateUrl: 'bank-card.component.html'
})
export class BankCardComponent implements OnInit{
    @Output() dialogEmit = new EventEmitter();
    public bankCardList = [];
    public bankList = [];
    
    public selectBank : string = "theFirst";
    /**
     * 選擇的省
     */
    public selectProvince : string = "theFirst";
    /**
     * 選擇的市
     */
    public selectCity : string = "theFirst";
    /**
     * 支行名稱
     */
    public branchBank : string = "";
    public accountName : string = "";
    public bankNo : string = "";
    public checkBankNo : string = "";
    public ChinaAreaKey : Array<string> = [];
        /**新增電話 確認帳號 ts html*/
        addPhone: number;
        /**新增QQ 確認帳號 ts html*/
        addQQ: string;
        /**新增wechat  確認帳號 ts html*/
        addWechat : string;
   /**安全馬 */
   safety : string;
    constructor(public globals: GlobalService, public api: ApiService) { }

    ngOnInit() {
        this.getMemberData(this.globals.getNowUid());
        this.getBankList();
        this.ChinaAreaKey = Object.keys(this.api.ChinaArea);
    }
    getBankList(){
        this.api.postServer(909, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("bank-card->銀行列表",res);
                return;
            }
            this.bankList = res.ret;
        });
    }
    // /**
    //  * 切換銀行卡
    //  * @param _index 
    //  */
    // changeBankCard(_index : number){
    //     let para = {uid : this.globals.getNowUid(), spw : "", id : this.bankCardList[_index].no, act : "edit"};
    //     this.doBankCard(para);
    // }
    /**
     * 新增銀行卡
     */
    setBankCard(){
        let para = {
                    uid : this.globals.getNowUid(),
                    act : "add",
                    back : this.selectBank,
                    backac : this.accountName,
                    account : this.bankNo,
                    reaccount : this.bankNo,
                    province : this.selectProvince,
                    city : this.selectCity,
                    bankbranch : this.branchBank,
                    phone:this.addPhone, 
                    QQ:this.addQQ ,
                    WeChat:this.addWechat,
                    wsecurity:this.safety
                  };
        //   console.log(para);
        this.doBankCard(para);
         this.selectBank = "theFirst";
        this.selectProvince = "theFirst";
        this.selectCity = "theFirst";
        this.accountName = "";
        this.bankNo = "";
        this.checkBankNo = "";
        this.branchBank = "";
        
    }
    /**
     * 修改/新增會員銀行 ， 參數 act : "edit"(切換) 與 "add"(新增)
     * 
     * @param _index
     */
    doBankCard(_para : any){
        this.api.postServer(912, _para).subscribe(res => {
            if(!res.err){
                console.log("綁定提款卡",res);
                return;
            }
            if(_para.act == "add"){
                 this.dialogEmit.emit({type: 'text', title : "资讯", data : "成功绑定银行卡"});
            }
            this.bankCardList = res.ret;
        });
    }
    /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData(_uid:string):void{
        this.api.postServer(960, { uid: _uid }).subscribe(res => {
            if(!res.err){
                console.log("bank-card->會員資料",res);
                return;
            }
            //設定會員資料
            let banklist = res.ret.info.membanklist;
            this.bankCardList = this.objectToArray(banklist);
        });
    }
    /**
     * angular2 的*ngFor 是array格式
     * 這來源是object 需要轉array
     */
    objectToArray(_object) : Array<Object> {
        let bankList=[];
        for(let data in _object) {
            bankList.push(_object[data]);
        }
        return bankList;
    }
}