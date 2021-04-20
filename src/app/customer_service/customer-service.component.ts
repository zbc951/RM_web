import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { openWin } from 'lib/config';
import { Subscription, Observable} from 'rxjs';
import { betRecordOptionToShow } from 'lib/functions';
@Component({
    selector: 'customer-service',
    templateUrl: 'customer-service.component.html'
})
//賽事結果
export class CustomerService implements OnInit, OnDestroy {

    /**
     * 客服回覆問題筆數
     */
    public helpcount : number;
    /**
     * 更新 965 串流
     */
    private moneyInfoSub: Subscription;

    public toggle : boolean = true;
    public newDatails : Array<any>;
    private newDetailsSub: Subscription;
    constructor(public globals: GlobalService, public api: ApiService) { }
    ngOnInit() {
        if(this.globals.getShowLogin()) return;

        //965 金額資訊
         this.moneyInfoSub = this.globals.moneyInfo$.subscribe(( res : any ) => {
            this.helpcount =  res.helpcount;
		});
        //650 下注明細
        this.newDetailsSub = this.globals.newDetails$.subscribe(( res : any ) => {
            //取3筆資料
            let fliterData =[];
            for (let i = 0, len = res.ret.length; i < len; i++) {
                if(res.ret[i].ptype)
                fliterData.push(res.ret[i]);
                if(i == 2) break;
            }
            fliterData = betRecordOptionToShow(fliterData);
            this.newDatails =  fliterData;
		});

        this.getDetailsData(); 
        if(document.documentElement.clientWidth >1800 ){
            this.toggle =true;
        }else{
            this.toggle =false;
        }
    }
    //當使用者改變瀏覽器的畫面大小時，會觸發 resize 這個 Event 進而進行條件判斷
    onResize(event) {
        // console.log(event);
        // console.log(event.target.innerWidth,event.target.innerWidth > 1800);
        if(event.target.innerWidth > 1800){
            this.toggle =true;
        }else{
            this.toggle =false;
        }

    }
    getDetailsData() {
        //                uid: number  //使用者憑證          , lang: string  //語系
        let parameter = { uid: this.globals.getNowUid(), lang: this.globals.getNowLang() };
        this.api.postServer(650, parameter).subscribe(res => {
            if(!res.err){
                console.log("下注明細",res);
                return;
            }
            //第一次先取得最新注單，把資料丟入串流 讓資料更新
            this.globals.newDatailsBridge(res);
        });
    }
    setServiceInfo(_qrcode :string, _title :string){
        this.globals.serviceInfo = {
            'qrcode' :  _qrcode,
            'title' : _title
        }
    }
    /**
	 *
	 * @param 
	 */
	dialogOn(msg: any) {
		switch (msg) {
			case 'closeDialog':
				//關閉qrcode dialog視窗
				this.globals.serviceInfo = false;
				break;
		}
	}
    /**
     * 
     * @param name 
     */
    changePage_membercenter(name: string[]) {
        let aa = new Date();
        name[1] = name[1]+"?"+aa.getTime(); 
	    this.globals.goPage(name);
	}
    ngOnDestroy(){
        this.moneyInfoSub.unsubscribe();
        this.newDetailsSub.unsubscribe();
    }
}