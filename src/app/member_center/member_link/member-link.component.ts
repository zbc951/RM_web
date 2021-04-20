import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService, GlobalService} from 'service';
import { Observable ,Subscription } from 'rxjs';
@Component({
    selector: 'member-link',
    templateUrl: 'member-link.component.html'
})
export class MemberLinkComponent  implements OnInit {
    @Output() dialogEmit = new EventEmitter();
    public memberLink : string = "";
    /**點擊視窗黑色部分 訂閱 ts*/
    private outsideDialogSub = new Subscription();
    constructor(public api: ApiService, public globals: GlobalService,) {
        
    }
    ngOnInit() {
        this.getMemberData();
        this.closeDialogDOM();
     }
         /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData():void{
        this.api.postServer(960, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("member-link->會員資料",res);
                return;
            }
            // console.log(res.ret.info['plink']);
            this.memberLink = res.ret.info['plink'];
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
        this.dialogEmit.emit('closeMemberLink');
    }
}
