import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { openWin } from 'lib/config';
import { Observable ,Subscription } from 'rxjs';
@Component({
    selector: 'qrcode-dialog',
    templateUrl: 'qrcode-dialog.component.html'
})
//賽事結果
export class QrcodeDialogComponent implements OnInit,OnDestroy {

    @Input() serviceInfo: any;
    @Output() dialogEmit = new EventEmitter();
    /**點擊視窗黑色部分 訂閱 ts*/
    private outsideDialogSub = new Subscription();
    constructor(public globals: GlobalService, public api: ApiService) { }

    ngOnInit() {
        this.closeDialogDOM();
    }

        /**點擊黑色半透明區塊，關閉 bet-dialog html */
    closeDialogDOM() {
        const dialogMainDOM = document.getElementsByClassName('qrcode_dialog');
        const mouseDown = Observable.fromEvent(dialogMainDOM, 'mousedown');
        //如果點選到的是 <main class="bet_dialog"> 的區域，關閉 bet-dialog html
        this.outsideDialogSub = mouseDown.filter(event => event['target']['className'] === 'qrcode_dialog')
                                         .subscribe(() => this.closeDialog() );
    }
    closeDialog(){
        this.dialogEmit.emit('closeDialog');
    }

    ngOnDestroy(){
        this.outsideDialogSub.unsubscribe();
    }
}