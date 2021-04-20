import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { gettime } from 'lib/functions';
import { getLangPipe } from '../app.pipes';

@Component({
    selector: 'bet-history-page',
    templateUrl: 'bet-history.component.html'
})
//历史帐务
export class BetHistoryComponent implements OnInit {
 constructor(private globals: GlobalService, public api: ApiService,private LangPipe:getLangPipe) { }
    /**
     * 取得 當前 查詢 日期的 key
     */
    public getKeyDate :string = "";
    /**
     * 單周資料
     */
    public firstData: Array<any> = [];
    /**
     * 上週資料
     */
    public secondData: Array<any> = [];
    /**
     * 總下注金額
     */
    public allGold: number = 0;
    /**
     * 实货量(不含退水)
     */
    public allWin_nw: number = 0;
    /**
     * 總投资结果(含退水)
     */
    public allWin: number = 0;
    /**
     * 上周總下注金額
     */
    public lastallGold: number = 0;
    /**
     * 上周实货量(不含退水)
     */
    public lastallWin_nw: number = 0;
    /**
     * 上周總投资结果(含退水)
     */

    public lastallWin: number = 0;
    /**
     *  呼叫  'lib/functions' 檔案內的  gettime  function
     */
    private timeobj: any = gettime();
    /**
     * 開關
     */
    //開始時間
    public starttime: string = this.timeobj.weekStartDate;
    //結束時間
    public endtime: string = this.timeobj.weekEndDate;
    //展開的變數
    public switch: any = {};



    /**
     * 改變 switch true false 按鈕
     * @param _t 時間 key
     */
    open(_t: string) {
        if(this.getKeyDate == 'year'){ return;}
        this.switch[_t] = !this.switch[_t];
    }
    /**
     * 點選查詢按鈕
     * @param _time1 開始時間
     * @param _time2 結束時間
     */
    search() {
        this.setKeyDate("Search");
    }
    /**
      * 從新整理
      */
    reload() {
        this.setKeyDate(this.getKeyDate);
    }

    /**
     * 一進來，執行本周上周資料api
     */
    ngOnInit() {
        this.setKeyDate("Biweekly");
    }
    /**
     * 
     * @param _key  查詢 想要的日期  並設定 key
     */
    setKeyDate(_key :string){
        this.firstData = [];
        this.allGold = 0;
        this.allWin_nw = 0;
        this.allWin = 0;

        this.secondData = [];
        this.lastallGold = 0;
        this.lastallWin_nw = 0;
        this.lastallWin = 0;

        this.getKeyDate = _key;

        switch(_key){
            case "Biweekly":
                this.getAccountData(this.timeobj.weekStartDate, this.timeobj.weekEndDate, 1);
                this.getAccountData(this.timeobj.lastWeekStartDate, this.timeobj.lastWeekEndDate, 2);
                this.starttime = this.timeobj.lastWeekStartDate;
                this.endtime = this.timeobj.weekEndDate;
                break;
            case "This week":
                this.getAccountData(this.timeobj.weekStartDate, this.timeobj.weekEndDate, 1);
                this.starttime = this.timeobj.weekStartDate;
                this.endtime = this.timeobj.weekEndDate;
                break;
            case "Last week":
                this.getAccountData(this.timeobj.lastWeekStartDate, this.timeobj.lastWeekEndDate, 1);
                this.starttime = this.timeobj.lastWeekStartDate;
                this.endtime = this.timeobj.lastWeekEndDate;
                break;
            case "This month":
                this.getAccountData(this.timeobj.monthStartDate, this.timeobj.monthEndDate, 1);
                this.starttime = this.timeobj.monthStartDate;
                this.endtime = this.timeobj.monthEndDate;
                break;
            case "Last month":
                this.getAccountData(this.timeobj.lastMonthStartDate, this.timeobj.lastMonthEndDate, 1);
                this.starttime = this.timeobj.lastMonthStartDate;
                this.endtime = this.timeobj.lastMonthEndDate;
                break;  
            case "Search" :
                    if ((new Date(this.endtime).valueOf() - new Date(this.starttime).valueOf()) / (86400 * 1000) > 31) {
                        alert(this.LangPipe.transform('Inquiry days should not be greater than 31 days',this.api.langPackage,undefined));
                        return;
                    }
                    this.getAccountData(this.starttime, this.endtime, 1);
                break;    
            case "year":
                this.getAccountData_year();
                break;
        }
    }
    /**
     * 撞護歷史(大綱) 610api
     * @param _stime 開始時間
     * @param _etime 結束時間
     * @param _status 狀態  1 :顯示 firstData  ，  2 :顯示 secondData                      
     */
    getAccountData(_stime: string, _etime: string, _status: number) {
        let parameter = {
            uid: this.globals.getNowUid(), lang: this.globals.getNowLang(), gtype: 'FT',sdate: _stime, edate: _etime
        };
        this.api.postServer(619, parameter).subscribe(res => {
            if(!res.err){
                console.log("歷史帳務",res);
                return;
            } 
            let data = res.ret;
            this.buttonArr(data);

            let allGoldTemp = 0;
            let allWin_nwTemp = 0;
            let allWinTemp = 0;
            for (let i = 0, len = data.length; i < len; i++) {
                allGoldTemp += data[i].gold;
                allWin_nwTemp += data[i].win_nw;
                allWinTemp += data[i].win;
            }

            switch(_status){
                case 1 :
                    this.firstData = data;
                    this.allGold +=allGoldTemp;
                    this.allWin_nw += allWin_nwTemp;
                    this.allWin += allWinTemp;
                    break;
                case 2 :
                    this.secondData = data;
                    this.lastallGold = allGoldTemp;
                    this.lastallWin_nw = allWin_nwTemp;
                    this.lastallWin = allWinTemp;
                    break;
            }
        });
    }

    /**
     * 撞護歷史(大綱) 623api
     * @param _stime 開始時間
     * @param _etime 結束時間
     * @param _status 狀態  1 :顯示 firstData  ，  2 :顯示 secondData                      
     */
    getAccountData_year() {
        let parameter = {
            uid: this.globals.getNowUid(),  gtype: 'FT'
        };
        this.api.postServer(623, parameter).subscribe(res => {
            if(!res.err){
                console.log("歷史帳務",res);
                return;
            } 
            let data = res.ret;
            this.buttonArr(data);
            let allGoldTemp = 0;
            let allWin_nwTemp = 0;
            let allWinTemp = 0;
            for (let i = 0, len = data.length; i < len; i++) {
                allGoldTemp += data[i].gold;
                allWin_nwTemp += data[i].win_nw;
                allWinTemp += data[i].win;
            }
            this.firstData = data;
            this.allGold +=allGoldTemp;
            this.allWin_nw += allWin_nwTemp;
            this.allWin += allWinTemp;
        });
    }

    /**
     * 建立對照陣列 
     * @param _data api回傳資料
     */
    buttonArr(_data: any) {
        for (let k in _data) {
            this.switch[_data[k].dtime] = false;
        }
    }
}