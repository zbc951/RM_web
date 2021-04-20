import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'deposit-postscript',
    templateUrl: 'deposit-postscript.component.html'
})
export class DepositPostscriptComponent implements OnInit{

    public bank = [{class: "bankimg",value:"一銀"},{class: "bankimg",value:"2銀"},{class: "bankimg",value:"3銀"},{class: "bankimg",value:"4銀"},
                  {class: "bankimg",value:"5銀"},{class: "bankimg",value:"6銀"},{class: "bankimg",value:"7銀"}];
    public selectedBank : string = "";
    public inputGold : number ;
    /**下注欄位 控制器 ts*/
    public betGoldInputControl = new FormControl();
    /**下注欄位控制器 訂閱 ts*/
    private betGoldInputControlSub = new Subscription();
    private memberSurplus : number;
    public erroMsg : string = "";
    constructor(private globals: GlobalService, public api: ApiService) { }

    ngOnInit() { 
        this.inputControl();
        this.getMemberSurplus();
    }
    /**
     * 取得會員下注設定、計算獲利
     */
    getMemberSurplus() {
    }
    doDepositSpeedyPay() : any{
        console.log("doDepositSpeedyPay");
        // let para = { uid : sessionStorage.getItem('uid'), gold : this.inputGold, bankac : this.account, bankname  : this.accountName, remark : ""};
        // this.selectedBank = "";
        // this.inputGold = 0;
        // // this.account = "";
        // // this.accountName = "";
        // this.api.postServer(762, para ).subscribe(res => {
        //     console.log("res",res);
        //     alert("申請成功，申請單號:"+ res.ret['withdrawalNo']);
        // });
    }

    inputControl() {
        this.betGoldInputControlSub = this.betGoldInputControl.valueChanges
            .debounceTime(300).subscribe((inputGold) => {
                console.log("inputGold",inputGold);
                this.erroMsg = '';
                if(inputGold < 100 && inputGold != null) { this.erroMsg = this.getLang('* The minimum bet amount is 100'); } //*最低下注金額為 100
                else if(inputGold > this.memberSurplus) { this.erroMsg = this.getLang("The amount of the bet exceeds the balance"); } //*下注金額超過餘額
            });
    }
    /**
     * 更新 金額
     */
    updateMoneyInfo(){
         this.api.postServer(965, { uid: this.globals.getNowUid() }).subscribe(res => {
            let moneyData = res.ret;
            this.globals.moneyInfoBridge(moneyData);
        });
    }

    getLang(_value){
        let langPackage = this.api.langPackage;
        if(langPackage == undefined || langPackage[_value] == undefined || this.globals.getNowLang() == "en") {
            return _value;
        }
        return langPackage[_value];
    }
}