import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'deposit-online',
    templateUrl: 'deposit-online.component.html'
})
export class DepositOnlineComponent implements OnInit, OnDestroy{

    public bank = [
                    {class: "bank_01",value:["icbc","中国工商银行"]},{class: "bank_02",value:["abchina","中国农业银行"]},{class: "bank_03",value:["ccb","中国建设银行"]},
                    {class: "bank_04",value:["cebbank","中国光大银行"]},{class: "bank_05",value:["cmbc","中国民生银行"]},{class: "bank_06",value:["cmbchina","招商银行"]},
                    {class: "bank_07",value:["boc","中国银行"]},{class: "bank_08",value:["cgbchina","广发银行"]},{class: "bank_09",value:["pingan","平安银行"]},
                    {class: "bank_11",value:["spdb","浦发银行"]},{class: "bank_12",value:["ecitic","中信银行"]},
                    {class: "bank_13",value:["hxb","华夏银行"]},{class: "bank_14",value:["cib","兴业银行"]},{class: "bank_15",value:["bankcomm","交通银行"]}
                  ];
        /**下注跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();
    public selectedBank : any = "";
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

    doDepositOnline() : any{
        let para = { uid : this.globals.getNowUid(), payid : "2", gold : this.inputGold, bank : this.selectedBank[0] };
        this.selectedBank = "";
        this.inputGold = null;
        this.api.postServer(574, para ).subscribe(res => {
            if(!res.err){
                console.log("在線支付回傳訊息",res);
                return;
            } 
            console.log("在線支付回傳訊息",res);
            this.dialogEmit.emit({
                                    type : "link",
                                    title : "申请成功",
                                    data : "请至弹跳视窗或前往连结，完成付款。(浏灠器请允许显示弹跳窗口)",
                                    link : [ res.ret , 'location=yes,fullscreen=yes,status=yes' ]
                                });
            this.globals.openLink(res.ret,'location=yes,fullscreen=yes,status=yes');
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