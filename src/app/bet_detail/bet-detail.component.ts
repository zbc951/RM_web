import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { betRecordOptionToShow } from 'lib/functions';
@Component({
    selector: 'bet-detail-page',
    templateUrl: 'bet-detail.component.html'
})
//下注明細
export class BetDetailComponent implements OnInit {
    constructor(private globals: GlobalService, public api: ApiService) { }
    /**
     * 650回傳參數
     */
    public betdetail: Array<any>;
    /**
     * 總下注金額
     */
    public allGold : number = 0;
    /**
     * 總獲利金額
     */
    public allEstimateGold : number = 0;
    /**
     * 手續費
     */
    private fee : number = 0.95;
    //開啟提示框
    public openMsg :Boolean =false;
    //提示資料
    public MsgData :any ={};

    //預防 測單按鈕重複案
    CancellationIng:boolean = false;
    //撤單完成 資訊
    OpenCancellation :boolean = false;
    //策單回傳資料
    CancellationMsg: any = '';
    /**
     * 下注狀況 650 api
     */

    TimeoutDetail :any;
    getDetailsData() {
        //                uid: number  //使用者憑證          , lang: string  //語系
        let parameter = { uid: this.globals.getNowUid(), lang: this.globals.getNowLang() };
        this.api.postServer(650, parameter).subscribe(res => {
            if(!res.err){
                console.log("下注明細",res);
                return;
            }
            this.globals.newDatailsBridge(res); //更新最新注單串流
            let fliterData = res.ret.map(item => {
                // if( item.bid == 5435 ){}
                                        if(item.detailed_content.hr == '-1' || item.detailed_content.cr == '-1'){
                                            //賽事取消
                                            item.detailed_content.gameCancel = true;
                                        }             
                                        return item;
                                    });
            this.calculationGold(fliterData);
            this.betdetail = betRecordOptionToShow(fliterData);
        });
    }
    /**
     * 處理總金額
     * @param _data 資料陣列
     */
    calculationGold(_data: Array<any>) {
        this.allEstimateGold = 0;
        this.allGold = 0;
        for (let i = 0, len = _data.length; i < len; i++) {
            //賽事取消  不計算
            if(_data[i].detailed_content.gameCancel){
                console.log("赛事取消",_data[i]);
                continue;
            }
            let gold = _data[i].gold;
            let profit = _data[i].profit;
            let water =  _data[i].water;
            // console.log(_data[i]);
            //一筆資料算出的獲利 再相加
            //     預估獲利   =  金額 *  獲利%數       *  手續費  +   退水
            let estimateGold = gold * (profit / 100) * this.fee;
            //新增 每筆的 預估獲利
            _data[i].estimateGold = estimateGold;
            //總金額
            this.allGold += gold;
            //總預估獲利
            this.allEstimateGold += estimateGold;
        }
    }
    /**
     * 重新整理
     */
    reload(){
        this.getDetailsData();
    }
    /**
     * 撤单
     */
    cancellation(_list){
        this.openMsg = true;
        this.MsgData = _list;


    }
    /**
     * 送出撤單
     */
    SendOutCancellation(){
        if(this.CancellationIng)return;
        this.CancellationIng = true;
        let parameter = { uid: this.globals.getNowUid(), wid: this.MsgData.bid, lang: this.globals.getNowLang() };
        this.api.postServer(333, parameter).subscribe(res => {
            this.CancellationIng = false;
            if(!res.err){
                this.openMsg = false;
                this.OpenCancellation =true;
                this.CancellationMsg =res.err_msg;
                return;
            }
            this.openMsg = false;
            this.OpenCancellation =true;
            this.CancellationMsg = res.ret;
        });
    }
    /**
     * 關閉訊息
     */
    closedMsg(){
        this.openMsg = false;
        this.MsgData ={};
    }
      /**
   * 關閉訊息視窗
   */
  closedCancellation(){
    this.getDetailsData();
    this.OpenCancellation = false;
    this.CancellationMsg ='';
  }
    /**
     * 執行
     */
    ngOnInit() {
        this.getDetailsData();
        this.TimeoutDetail= setInterval(() => {
            this.getDetailsData();
          }, 60000);
    }
    
    ngOnDestroy() {
        clearTimeout(this.TimeoutDetail);
    }
}