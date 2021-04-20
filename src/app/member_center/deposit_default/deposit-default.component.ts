import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'deposit-default',
    templateUrl: 'deposit-default.component.html'
})
export class DepositDefaultComponent implements OnInit, OnDestroy{

    public type : any;
    /**跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();

    constructor(public globals: GlobalService, public api: ApiService) { }
      /**會員資料 ts html*/
      profile: any = {
        payinfo:[]
      };

    ngOnInit() { 
        this.getMemberData(this.globals.getNowUid());
    }
    setType(type){
            //网银支付 = wy、快捷支付 = kj、扫码支付=sm、H5支付=h5、云闪支付=ys
        this.type = type;
        switch(type){
            case "serial":
                //延遲0.1 讓點擊框框 css顯示出來
                setTimeout(() => {
                    this.dialogEmit.emit("deposit_serial");
                }, 100);
                break;
            case "ichat":
                //延遲0.1 讓點擊框框 css顯示出來
                setTimeout(() => {
                    this.dialogEmit.emit("deposit_ichat");
                }, 100);
                break;
            default:
                this.globals.openDepositLink(type);
        }
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
            this.profile =res.ret;
        });
    }

    getLang(_value){
        let langPackage = this.api.langPackage;
        if(langPackage == undefined || langPackage[_value] == undefined || this.globals.getNowLang() == "en") {
            return _value;
        }
        return langPackage[_value];
    }
    showChatlink(){
        window.open('/app2/chatlink.html');
    }
    ngOnDestroy() {

    }
}