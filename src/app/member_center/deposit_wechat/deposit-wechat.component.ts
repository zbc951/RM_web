import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'deposit-wechat',
    templateUrl: 'deposit-wechat.component.html'
})
export class DepositWechatComponent implements OnInit, OnDestroy{
    /**下注跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();
    public inputGold : number ;
    /**下注欄位 控制器 ts*/
    public goldInputControl = new FormControl();
    /**下注欄位控制器 訂閱 ts*/
    private goldInputControlSub = new Subscription();
    public erroMsg : string = "";

    constructor(private globals: GlobalService, public api: ApiService) { }

    ngOnInit() {
        // this.inputControl();
    }
    doWechat() : any{
        let para = { uid : this.globals.getNowUid(), payid : "1", gold : this.inputGold, bank : "weixin" };
        // console.log(this.bankData,para);
        this.inputGold = null;
        this.api.postServer(570, para ).subscribe(res => {
            if(!res.err){
                console.log("微信支付回傳訊息",res);
                return;
            } 
            // console.log("微信支付回傳訊息",res);
            this.dialogEmit.emit({
                                    type : "link",
                                    title : "申请成功",
                                    data : "请至弹跳视窗或前往连结，扫描完成付款。(浏灠器请允许显示弹跳窗口)",
                                    link : [ res.ret["QRlink"], 'height=250,width=250,status=yes' ]
                                });
            this.globals.openLink(res.ret["QRlink"], 'height=250,width=250,status=yes');
        });
    }

    inputControl() {
        this.goldInputControlSub = this.goldInputControl.valueChanges.subscribe((inputGold) => {
                this.erroMsg = '';
                if(inputGold == null){
                    return;
                }
                if(inputGold < 100) { 
                    this.erroMsg = "单笔存款金额最低100元"  //*單筆存款金額最低100元
                }else if(new RegExp("[\\d]+\\.").test(inputGold)){
                    this.erroMsg = "单笔存款金额请输入整数";
                }else if(inputGold > 3000){
                    this.erroMsg = "单笔存款金额最高3,000元";
                }
            });
    }
    getLang(_value){
        let langPackage = this.api.langPackage;
        if(langPackage == undefined || langPackage[_value] == undefined || this.globals.getNowLang() == "en") {
            return _value;
        }
        return langPackage[_value];
    }
    ngOnDestroy() {
        this.goldInputControlSub.unsubscribe();
    }
}