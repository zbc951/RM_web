import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { getLangPipe } from '../app.pipes';
@Component({
    selector: 'member-center',
    templateUrl: 'member-center.component.html'
})
export class MemberCenterComponent implements OnInit {
    /**
     * 設定 判斷後的clss 
     */
    public selectClass : {};
    /**
     * 我的帳戶 左側邊攔選擇的項目
     */
    public selectItem : string = "";
    /**
     * 存款的選擇項目
     */
    public selectItem_deposit : string = "";
    /**
     * 存款的選擇項目
     */
    public selectItem_withdraw : string = "";
    /**
     * 彈跳視窗是否顯示  show list
     */
    public showDialog : any =false;

    constructor(private route: ActivatedRoute, public globals: GlobalService, public api: ApiService ,private LangPipe:getLangPipe) { }

     ngOnInit() {
         //route 每次傳進來的變數
        this.route.params.subscribe(getKey => {
            let temp = getKey['key'];
            if(temp.indexOf("?") >-1){
                temp = temp.slice(0, temp.indexOf("?"));
            }
            this.selectItem = temp;
            //每次傳進來必須變更
            this.setSelectClass();
        });
        // or
        // this.selectItem = this.route.params['_value']['key'];

        //預設選擇是流水號
        this.selectItem_deposit="deposit_default";
        this.closeDialogDOM();
    }
    /**
     * 設定 class 物件
     */
    setSelectClass() {
        this.selectClass = {
            deposit : this.selectItem == 'deposit',
            withdra : this.selectItem == 'withdraw' || this.selectItem == 'bankCard',
            bankcd : this.selectItem == 'bankCard',
            mbtsrd : this.selectItem == 'record',
            mbif : this.selectItem == 'userData',
            mblink : this.selectItem == 'memberLink',
            mbprob : this.selectItem == 'problem',
            betrecord: this.selectItem == 'betrecord'
        }
    }

    /**
     * 側邊攔變更後的設定
     */
    changeSelectItem(_item: string):void{
        this.selectItem=_item;
        this.setSelectClass();
    }
    /**
     * @Output 觸發
     */
    appDialogOn(msg: any) {
        this.showDialog = msg;
    }
    /**
     * @Output 觸發
     */
    dialogToPage(msg: any) {
        this.selectItem = 'userData';
        this.setSelectClass();
    }
    /**
     * 點擊黑色半透明區塊，關閉彈跳視窗 
     */
    closeDialogDOM() {
        const dialogMainDOM = document.getElementsByClassName('center_member');
        const mouseDown = Observable.fromEvent(dialogMainDOM, 'mousedown');
        //如果點選到的是 <main class="bet_dialog"> 的區域，關閉 bet-dialog html
        mouseDown.filter(event => event['target']['className'] === 'blackBg').subscribe(() => {this.closeDialog()});
    }
    closeDialog() {
        this.showDialog = false;
    }
                    /**
     * 開啟代理
     */
    openagPage() {
        let select = confirm(this.LangPipe.transform('Open the webpage, please contact customer service if you have any questions',this.api.langPackage,undefined));
        if(select) {
            window.open(
                'https://ag.168801.net/'
            );
        }
    }
}
// http://embed.plnkr.co/PD4Ap8/