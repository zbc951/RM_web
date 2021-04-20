import { Component, OnInit, OnDestroy} from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'header-toolbar',
    templateUrl: 'header.component.html'
})
/**
 * 主頁面上的 header
 */
export class HeaderComponent implements OnInit, OnDestroy {
    /**
	 * marquee訂閱
	 */
	private marqueeInfoSub: Subscription;
    /**
     * 現在時間
     */
    public nowTime : string = "";
    /**
     * 跑馬燈
     */
    public marqueeData : string = "";
    /**
     * 當前語言 顯示的名稱
     */
    public selectLang : string = "";
    /**
     * 當前語言 顯示的 css 國旗
     */
    public selectLangClass = {};
    public detailCount : number = 0;
    private newDetailsSub: Subscription;
    private moneyInfoSub: Subscription;
    onlinepeople=0;
    constructor(public globals: GlobalService, public api: ApiService) { }

    ngOnInit() {
        this.doReload();
        this.NowLang();
        this.nowTime = new Date().toString().slice(0,new Date().toString().indexOf("("));
        Observable.interval(1000).subscribe( () => this.nowTime = new Date().toString().slice(0,new Date().toString().indexOf("(")));
        // switch (this.selectLang) {
        //     case "English":
        //         this.nowTime = new Date().toString().replace("台北標準時間", "Beijing");
        //         Observable.interval(1000).subscribe( () => this.nowTime = new Date().toString().replace("台北標準時間", "Beijing") );
        //         break;
        //     case "简体中文":
        //         this.nowTime = new Date().toString().replace("台北標準時間", "北京标准时间");
        //         Observable.interval(1000).subscribe( () => this.nowTime = new Date().toString().replace("台北標準時間", "北京标准时间") );
        //         break;
        //     case "繁體中文":
        //         this.nowTime = new Date().toString().replace("台北標準時間", "北京標準時間");
        //         Observable.interval(1000).subscribe( () => this.nowTime = new Date().toString().replace("台北標準時間", "北京標準時間") );
        //         break;

        //     default:
        //         break;
        // }

        /**
         * 跑馬燈的串流
         */
        this.marqueeInfoSub = this.globals.marqueeInfo$.subscribe(( res : any ) => {
            this.marqueeData = "";

            if(!res || res.length == 0){
                return;
            }
            res.map((item) => {
                this.marqueeData += item.content+"\t";
            });
        });
        this.newDetailsSub = this.globals.newDetails$.subscribe(( res : any ) => {
            this.detailCount = res.ret.length;
        });
        this.moneyInfoSub = this.globals.moneyInfo$.subscribe(( res : any ) => {
           console.log(res);
           this.onlinepeople = res.onlinepeople;
		});
    }
    /**
     * 判斷是否重新整理
     */
     doReload(){
        this.api.checkUid();
        if(!this.globals.getNowUid()) return;
        this.api.getIchatInfo(this.globals.getNowUid());
        this.globals.setShowLogin(false);

        if(sessionStorage.getItem("Logout")=='Y'){
            this.globals.setShowLogout(true);
        }else{
            this.globals.setShowLogout(false); 
        }
        this.getMarquee();
     }
     /**
      * 取得跑馬燈顯示的資料
      */
     getMarquee():void{
        this.api.postServer(810, { uid:this.globals.getNowUid() ,lang: this.globals.getNowLang() }).subscribe(res => {
            if(!res.err){
                console.log("跑馬燈",res);
                return;
            }
            let data = res.ret;
            this.globals.marqueeInfoBridge(data);
        });
     }
    changePage(name: string[]) {
        this.globals.goPage(name);
	}
    /**
     * 改變當前語言的值 存在 sessionStorage 內
     * @param _setlang
     */
    changeLanguage(_setlang : string){
        if(this.globals.getNowLang() == _setlang){
            return;
        }
        if(location.search.indexOf("?") > -1){
            location.href = location.href.replace(this.globals.getNowLang(),_setlang);
            return;
        }
        sessionStorage.setItem("lang",_setlang);
        location.reload();
    }
    /**
     * 取得當前語言的 物件
     */
     NowLang(){
        switch(this.globals.getNowLang()){
            case 'zh-tw' :
                this.selectLang = "繁體中文";
                this.selectLangClass = { lg_tw : true };
                break;
            case 'zh-cn' :
                this.selectLang = "简体中文";
                this.selectLangClass = { lg_cn : true };
                break;
            case 'en-us' :
                this.selectLang = "English";
                this.selectLangClass = { lg_en : true };
                break;
        }
    }
    /**
     * LoginComponent 更新帳務餘額時，會 @Output 呼叫此function
     */
    doBackTime(msg: any){
        this.getMarquee();
    }

    ngOnDestroy(){
        this.marqueeInfoSub.unsubscribe();
        this.newDetailsSub.unsubscribe();
    }
}