import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { getLangPipe } from '../app.pipes';
@Component({
    selector: 'game-result-page',
    templateUrl: 'game-result.component.html'
})
//賽事結果
export class GameResultComponent implements OnInit {
    constructor(private globals: GlobalService, public api: ApiService,private LangPipe:getLangPipe) { }

    /**
     * 680回傳參數
     */
    public gameResult : Array<any> = [];
    /**
     * 搜尋日期
     */
    public searchDate : string = "";

    /**
     * 收尋日期
     * @param _time 時間 格式yyyy-MM-dd
     */
    search(){
        this.getResultData(this.searchDate);
    }
    /**
     * 賽事结果 680 api
     * @param _searchDate  查詢日期
     */
    getResultData(_searchDate : string){
        //               uid:  使用者憑證                  ， lang: string   語系            ，  date:   日期      ， gtype: 球種 
        let parameter= { uid: this.globals.getNowUid(), lang: this.globals.getNowLang(),  date: _searchDate ,gtype:  'FT' };
        this.api.postServer(680, parameter).subscribe(res => {
            if(!res.err){
                console.log("賽事结果",res);
                return;
            } 
            this.gameResult = res.ret.map(item => {
                                            item['lname'] = item['lname'] == null ? "" : item['lname'];
                                            if(item.PD == '-1--1' || item.PDHR == '-1--1'){
                                                item.PD = this.LangPipe.transform('Games cancel',this.api.langPackage,undefined);
                                                item.PDHR= this.LangPipe.transform('Games cancel',this.api.langPackage,undefined);
                                                item.am =this.LangPipe.transform('Games cancel',this.api.langPackage,undefined);
                                            }
                                            if(item.PD == '-2--2' || item.PDHR == '-2--2'){
                                                item.PD = this.LangPipe.transform('To determined',this.api.langPackage,undefined);
                                                item.PDHR= this.LangPipe.transform('To determined',this.api.langPackage,undefined);
                                                item.am =this.LangPipe.transform('To determined',this.api.langPackage,undefined);
                                            }
                                            item.PD       =  item.PD;
                                            item.PDHR     =  item.PDHR;
                                            item.am       =  item.am;               
                                            return item;
                                    });
        });
    }
    
    
    /**
     * 一骰進入執行 預設今天
     */
    ngOnInit() {
        //                現在時間 yyyy-mm-dd   toISOString(ie9)
        this.searchDate = new Date().toISOString().substring(0, 10);
        this.getResultData(this.searchDate);
    }
}