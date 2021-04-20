import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'deposit-ichat',
    templateUrl: 'deposit-ichat.component.html'
})
export class DepositIchatComponent implements OnInit{

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
                }else if(inputGold > this.globals.getIchatBalance()){
                    this.erroMsg = "存入金額大於ichat金額";
                }
        });
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
    /**
     *  填入正確資訊後  呼叫 760 gateway
     */
    doIchatIn() : any {
        let para = { uid: this.globals.getNowUid() ,cash: this.inputGold,type: 0};
        this.inputGold = null;
        this.api.postServer(763, para ).subscribe(res => {
            if(!res.err){
                console.log("login->更新金額",res);                            
                return;
            } 
            console.log(res);
            // let moneyData = res.ret;
            this.updateMoneyInfo();
            this.dialogEmit.emit({type: '', title : "ichat成功转入", data :""});
        });
    }
    goBack(){
        this.goBackEmit.emit({});
    }
    ngOnDestroy() {
        this.inputGoldControlSub.unsubscribe();
    }
}