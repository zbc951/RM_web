import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'withdraw-default',
    templateUrl: 'withdraw-default.component.html'
})
export class WithdrawDefaultComponent implements OnInit, OnDestroy{

    public type : any;
    /**跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();

    constructor(public globals: GlobalService, public api: ApiService) { }

    ngOnInit() { 
    }
    setType(type){
        this.type = type;
        switch(type){
            case "serial":
                //延遲0.1 讓點擊框框 css顯示出來
                setTimeout(() => {
                    this.dialogEmit.emit("withdraw_serial");
                }, 100);
                break;
            case "ichat":
                //延遲0.1 讓點擊框框 css顯示出來
                setTimeout(() => {
                    this.dialogEmit.emit("withdraw_ichat");
                }, 100);
                break;
            default:
                this.globals.openDepositLink(type);
        }
    }
    

    getLang(_value){
        let langPackage = this.api.langPackage;
        if(langPackage == undefined || langPackage[_value] == undefined || this.globals.getNowLang() == "en") {
            return _value;
        }
        return langPackage[_value];
    }
    ngOnDestroy() {

    }
}