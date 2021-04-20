import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService, GlobalService} from 'service';
import { Observable ,Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
    selector: 'ichat-atm',
    templateUrl: 'ichat-atm.component.html'
})
export class IchatAtmComponent  implements OnInit {
    @Output() dialogEmit = new EventEmitter();
    @Input() ATMtype : string;
    /**點擊視窗黑色部分 訂閱 ts*/
    private outsideDialogSub = new Subscription();
    /** 輸入金額錯誤訊息 */
    public erroMsg :string = "";
    /**
     * 輸入金額
     */
    public inputGold : number ;
    /**下注欄位 控制器 ts*/
    public goldInputControl = new FormControl();
    /**下注欄位控制器 訂閱 ts*/
    private goldInputControlSub = new Subscription();
    /**
     * 金額資訊訂閱
     */
    private moneyInfoSub : Subscription;
    /**會員餘額 ts*/
    private memberSurplus : any;

    constructor(public api: ApiService, public globals: GlobalService,) {
        
    }
    ngOnInit() {
        this.moneyInfoSub = this.globals.moneyInfo$.subscribe(( res : any ) => {
            //取得會員設定
            this.memberSurplus = res.surplus;
		});
        this.updateMoneyInfo();
        this.closeDialogDOM();
        this.inputControl();
        this.api.getIchatInfo(this.globals.getNowUid());
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
    /**控制 input 控制器*/
    inputControl() {
        switch(this.ATMtype){
            case "ichat_ATM_in":
            this.goldInputControlSub = this.goldInputControl.valueChanges
            //  .debounceTime(300)  延遲0.3秒
                .subscribe((inputGold) => {
                    this.erroMsg = '';
                    if(inputGold < 100 && inputGold != null) { this.erroMsg = this.api.getLang('*The minimum bet amount is 100'); } //*最低下注金額為 100
                    else if(inputGold > this.globals.getIchatBalance() ) { this.erroMsg = this.api.getLang('存入金額大於ichat金額'); } //*最低下注金額為 100
                });
                break;
            case "ichat_ATM_out":
            this.goldInputControlSub = this.goldInputControl.valueChanges
            //  .debounceTime(300)  延遲0.3秒
                .subscribe((inputGold) => {
                    this.erroMsg = '';
                    if(inputGold < 100 && inputGold != null) { this.erroMsg = this.api.getLang('*The minimum bet amount is 100'); } //*最低下注金額為 100
                    else if(inputGold > this.memberSurplus) { this.erroMsg = this.api.getLang("轉出金額大於鉅富網餘額"); } //*下注金額超過餘額
                });
                break;
        }
    }
    /**
     * [type] => (0:存款 1:提款)
     */
    ichat_ATM(type){
        let para = { uid: this.globals.getNowUid() ,cash: this.inputGold,type: type};
        this.inputGold = null;
        this.api.postServer(763, para ).subscribe(res => {
            if(!res.err){
                console.log("login->更新金額",res);                            
                return;
            } 
            console.log(res);
            // let moneyData = res.ret;
            this.updateMoneyInfo();
            this.closeDialog();
        });
    }


    /**點擊黑色半透明區塊，關閉 bet-dialog html */
    closeDialogDOM() {
        const dialogMainDOM = document.getElementsByClassName('blackBg');
        const mouseDown = Observable.fromEvent(dialogMainDOM, 'mousedown');
        //如果點選到的是 <main class="bet_dialog"> 的區域，關閉 bet-dialog html
        this.outsideDialogSub = mouseDown.filter(event => event['target']['className'] === 'blackBg')
                                         .subscribe(() => this.closeDialog() );
    }

    closeDialog(){
        this.goldInputControlSub.unsubscribe();
        this.dialogEmit.emit('closeMemberLink');
    }
}
