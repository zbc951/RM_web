import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'bulletin-page',
    templateUrl: 'bulletin-board.component.html'
})
/**
 * 公告主頁面 
 */
export class BulletinBoardComponent implements OnInit, OnDestroy {
    /**
     *  公告資料
     */
    public bulletinBoardData : Array<any>;
    /**
	 * marquee訂閱
	 */
	private marqueeInfoSub: Subscription;
    constructor(private globals: GlobalService, public api: ApiService) { }
    ngOnInit() {
         this.marqueeInfoSub = this.globals.marqueeInfo$.subscribe(( res : any ) => {
            if(!res) return;
            this.bulletinBoardData = res;
        });
        this.getBulletinBoardData();
       
     }
    /**
     * 公告欄 api
     */
    getBulletinBoardData(): void {
        this.api.postServer(810, { uid : this.globals.getNowUid(), lang : this.globals.getNowLang() }).subscribe(res => {
            if(!res.err){
                console.log("公告欄",res);
                return;
            } 
            this.globals.marqueeInfoBridge(res.ret);
        });
     }
     reload(){
         this.getBulletinBoardData();
     }
     ngOnDestroy(){
        this.marqueeInfoSub.unsubscribe();
     }
}