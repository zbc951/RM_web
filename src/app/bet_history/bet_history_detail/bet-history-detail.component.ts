import { Component, OnInit ,Input } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { gettime } from 'lib/functions';
import { betRecordOptionToShow } from 'lib/functions';
@Component({
    selector: 'bet-history-detail',
    templateUrl: 'bet-history-detail.component.html'
})
//历史帐务
export class BetHistoryDetailComponent implements OnInit {
    @Input()
    dataTime: string;
     constructor(private globals: GlobalService, public api: ApiService) { }
     /**
      * 細單資料
      */
    public thisweek : Array<any> = [];
    /**
     * 總下注金額
     */
    public allGold : number = 0;
    /**
     * 總獲利金額
     */
    public allWin : number = 0;
    /**
     * 手續費
     */
    private fee : number = 0.95;

    /**
     * 處理總金額
     * @param _data 資料陣列
     */
    calculationGold(_data: Array<any>) {
        this.allWin=0;
        this.allGold =0;
        for (let i = 0, len = _data.length; i < len; i++) {
            //赛事取消  不計算
            if(_data[i].detailed_content.gameCancel){
                console.log("赛事取消",_data[i]);
                continue;
            }
            //總金額
            this.allGold += _data[i].gold;
            //總預估獲利
            this.allWin +=_data[i].win;
        }
    }
    /**
     * 撞護歷史(大綱) 620api
     * @param _date 時間
     */
    getAccountData(_date: string) {
        let parameter = {
            uid: this.globals.getNowUid(), lang: this.globals.getNowLang(), gtype: 'FT',
            date: this.dataTime
        };
        this.api.postServer(620, parameter).subscribe(res => { 

        let fliterData = res.ret.map(item => {
                                    if(item.detailed_content.hr == '-1' || item.detailed_content.cr == '-1'){
                                        //赛事取消
                                        item.detailed_content.gameCancel = true;
                                        item.detailed_content.text = 'Games cancel';
                                    }      
                                    if(item.detailed_content.hr == '-2' || item.detailed_content.cr == '-2'){
                                        //赛事取消
                                        item.detailed_content.gameCancel = true;
                                        item.detailed_content.text = 'To determined';
                                    }   
                                    return item;
                                });
            this.thisweek = betRecordOptionToShow(fliterData);
            this.calculationGold(fliterData);
        });
     

    }
    ngOnInit() {
        if(this.thisweek.length == 0){
            this.getAccountData(this.dataTime);
            // console.log(this.dataTime);
        }

    }
}