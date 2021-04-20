import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, GlobalService } from 'service';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { gameInfoOptionToShow, betRecordOptionToShow} from 'lib/functions';
import { getLangPipe } from '../app.pipes';
@Component({
    selector: 'game-table',
    templateUrl: 'game-table.component.html'
})

//賽事列表、賠率表 及 下注  By. Ian
export class GameTableComponent implements OnInit, OnDestroy {
    constructor(public api: ApiService, public globals: GlobalService, private activatedRoute: ActivatedRoute,private LangPipe:getLangPipe) { }
    /**設定球種 ts*/
    private gtype :string = this.activatedRoute.params['_value']['type'];
    /**語言包 訂閱 ts*/
    private langPackageSub :Subscription;
    /**賽事列表(單球種) 訂閱 ts*/
    private gamelistSub :Subscription;
    /**賠率表(賽事) 訂閱 ts*/
    private gameInfoSub :Subscription;
    /**更新倒數計時器 ts*/
    private gameListBack :any = null;
        /**更新倒數計時器 ts*/

    /**更新倒數計時器 ts*/
    private updateCounter :any = null;
    /**更新倒數計時器 ts*/
    private updateLisCounter :any = null;
    /**設定更新倒數時間(賽事列表、賠率表) ts*/
    private updateTime :number = 60;
    /**更新賽事 ts*/
    private updateGame: Promise<any>;
    /**賽事列表切換按鈕 ts html*/
    public switchButton: Array<string> = [];

    /**賽事列表 (單球種) ts html*/
    public gamelist: Array<any>;
    /**賽事列表 (單球種)(日期) ts html*/
    public gamelist_date: Array<string>;
    /**賽事列表 (單球種)(聯盟) ts html*/
    public gamelist_lid: Array<any> = [];
    /**賽事賠率表更新 現在倒數時間 ts html*/
    public updateInfoTiming :number;
    /**賽事列表更新 現在倒數時間 ts html*/
    private updateListTiming :number;
    /**被選到的賽事 {gid / lid / ht / ct / _gdate / _gtime / time} ts html*/
    public gameItem: any = {};
    /**被選到賽事的 賠率表 [{gold成交量 / ptype / table -> {option選項 / win獲利 / trade可交易量 / enable} }] ts html*/
    public gameInfo: Array<any>;
    /**
     * 下注明細
     */
    public newDatails : Array<any>;
    /**
     * 下注明細(訂閱)
     */
    private newDetailsSub: Subscription;
    /**對戰紀錄資料 ts html*/
    recordFile: Array<object>;
    oldGid = 0;
    OpenRecordFile = false;

    /**語系對照表 */
    lang_name={
        'zh-tw':'c',
        'zh-cn':'g',
        'en-us':'e',
        'ja-jp':'j'
    }
    ngOnInit() {
        this.getGameList();
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
        this.updateInterval('gameList');
    }

    languageToGameList(){
        let req = { uid: this.globals.getNowUid(), gtype: this.gtype, lang: this.globals.getNowLang() };
        //語系對照表 api
        this.langPackageSub = this.api.postServer(180, req).subscribe((res) => {
            if(!res.err){
                console.log("語言包",res);
                return;
            }
            let langPackage = res.ret;
            if(!langPackage){
                console.log(" 語言包 沒資料 ");
                return;
            }
           
        });
    }
    getNewRecord(_gid) {
        if(this.OpenRecordFile){
            this.OpenRecordFile = false;
            this.recordFile = undefined;
        }else{
            let req = { 'uid':this.globals.getNowUid(), 'gid': _gid };
            this.api.postServer(770, req)
                .filter(apiRes => apiRes.err == true).subscribe(apiRes => {
                    if(apiRes.ret.length == 0){
                        alert(this.LangPipe.transform('No record of battle',this.api.langPackage,undefined));
                        this.OpenRecordFile = false;
                        return
                    }
                    console.log(apiRes);
                    this.recordFile = apiRes.ret;
                    this.OpenRecordFile = true;
                });
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
    /**
     * 取得賽事列表 (單球種) 120
     */
    getGameList() {
        let req = { uid: this.globals.getNowUid(), gtype: this.gtype , lang: this.globals.getNowLang()};
        //賽事列表訂閱
        this.gamelistSub = this.api.postServer(120, req).subscribe((res) => {

            if(res.err === true) {
                if(Object.keys(res.ret).length == 0){
                    return;
                }
                //日期陣列(分類日期用)
                let datelist = [];
                //聯盟陣列(分類聯盟用)
                let leaguelist = [];
                //格式化資料時間戳、賽事列表日期、聯盟陣列置入

                this.gamelist = res.ret
                                .filter((item) =>{
                                    // console.log(item);
                                    //gateway 120 每筆資料 去 語言包找出對應名稱
                                    //主隊或客隊名稱沒找到  直接show 
                                    
                                    if(!item['ctname']|| !item['htname'] || !item['lname']||
                                         !item['lname']  ||
                                    !item['htname'] ||
                                    !item['ctname']){
                                        console.log("語言包內 無 對應 聯盟 或 主隊 或 客隊 名稱", item);
                                        return false;
                                    }
                                    item.ht = item['htname'] || item.ht;
                                    item.ct = item['ctname'] || item.ct;
                                    //聯盟沒找到名稱  直接show lid
                                    item.lid = item['lname'] ||item.lid;
                                    return true;
                                })
                                .map((item) => {
                                    // item.time = new Date().getTime()+3600000;
                                    // item.time = 1495339927028 -1860000;
                                    // console.log(item.time);
                                    //格式化資料時間戳
                                    let gdate    = new Date(item.time);
                                    let _month   = ("0" + (gdate.getMonth() + 1)).slice(-2);
                                    let _date    = ("0" + gdate.getDate()).slice(-2);
                                    let _hours   = ("0" + gdate.getHours()).slice(-2);
                                    let _minutes = ("0" + gdate.getMinutes()).slice(-2);
                                    let _gdate = _month + '/' + _date;
                                    let _gtime = _hours + ':' + _minutes;
                                    //置入格式化後的時間到this.gamelist (template賽事列表使用)
                                    item._gdate = _gdate;
                                    item._gtime = _gtime;
                                    //賽事列表日期、聯盟陣列置入
                                    datelist.push(_gdate);
                                    leaguelist.push(item.lid);
                                    return item;
                                })
                // console.log(this.gamelist);
                //移除日期陣列的重複
                this.gamelist_date = datelist.filter((item, index, arr) => {
                    return arr.indexOf(item) === index;
                })
                //計算賽事列表聯盟次數
                let listLid = {};
                leaguelist.map((item) => {
                    if(typeof(listLid[item]) === 'undefined') {
                        listLid[item] = 1;
                    }else {
                        listLid[item]++;
                    }
                });
                //賽事列表聯盟置入 (lid: 聯盟 / count: 賽事數量)
                //清空 賽事列表聯盟 避免更新累加
                this.gamelist_lid.length = 0;
                for(let key in listLid) {
                    this.gamelist_lid.push({ lid: key, count: listLid[key] });
                }

                //一開始登入 預設是 全部賽事的第一場比賽 ， 用 this.gameItem 初始值來判定是否點擊過
                if(Object.keys(this.gameItem).length == 0){
                    this.switchButton[0] = "ALL";
                    this.getGameInfo(this.gamelist[0]);
                }

                clearInterval(this.gameListBack);
                this.setGameListTimeInfo();
                this.gameListBack = setInterval(() => {
                    this.setGameListTimeInfo();
                }, 1000);

            }else {
                switch (res.err_msg) {
                    case 12001:
                        //不該發生: 可能在抓取 URL 的 /:type 有問題
                        alert(this.LangPipe.transform('Wrong input',this.api.langPackage,undefined));
                        this.globals.goPage(['main']);
                        break;
                    default:
                        break;
                }
            }
        })
    }
    setGameListTimeInfo(){
        this.gamelist.map((item) => {
            let nowTime = new Date().getTime();
            let lastHr = item.time - 3600000;
            if(nowTime > lastHr && item.time > nowTime){
                // console.log(nowTime,item.time,item.time-nowTime);
                let mytime = ( item.time -nowTime )/1000;
                let d = Math.floor(mytime / (24 * 3600));
                let h = Math.floor((mytime % (24*3600))/3600);
                let m = ("0" + Math.floor((mytime % 3600)/(60))).slice(-2);
                let s = ("0" + Math.floor(mytime%60)).slice(-2);
                // let str = d + "天 " + h + "时 " + m + "分 " + s + "秒 ";
                let lastMin = item.time - 600000;
                let fastCloseGame = "";
                if(nowTime > lastMin){
                    fastCloseGame = "即将封盘";
                }
                let backTime ="("+ m + "分 " + s + "秒 "+ fastCloseGame +")";
                // console.log(backTime);
                item.backTime = backTime;
            }
        });
    }
    /**
     * 取得賽事賠率表 gateway 100 ，由點擊列表觸發
     * @param item 被選擇到賽事的item
     */
    getGameInfo(item) {
        
        if(!item){
            console.log(item,'無賽事資料');
            return;
        }
        if(item.gid != this.oldGid || this.oldGid == 0){
            this.OpenRecordFile =false;
            this.oldGid =item.gid ;
        }
        
        let req = { uid: this.globals.getNowUid(), gtype: this.gtype, gid: item.gid };
        //賽事賠率表訂閱
        this.gameInfoSub = this.api.postServer(130, req).subscribe((res) => {
            //如果取得賠率表成功、且不為空值(未關盤)
            if(res.err === true && Object.keys(res.ret).length !== 0 ) {
                //被選擇到的賽事資訊 120
                this.gameItem = item;   //{ gid / lid / ht / ct / _gdate / _gtime / time }
                //被選擇到的賽事賠率表 100，增添"玩法"欄位，並轉成陣列，有資料表示打開 table
                let gameInfo = res.ret.ptype;
                this.gameInfo = Object.keys(gameInfo).map(item => {
                    
                    gameInfo[item].ptype = item;       //增加玩法的欄位

                    return gameInfo[item];  //[{gold成交量 / ptype / table -> {option選項 / win獲利 / trade可交易量 / enable} }]
                });

                this.gameInfo = gameInfoOptionToShow(this.gameInfo);
                // console.log(this.gameInfo);
                // this.gameInfo.sort(function(a,b) {
				//     return new Date(a.c + " " + a.d) - new Date(b.c + " " + b.d);
			    // });
                // console.log(this.gameInfo );
                //點擊賽事重設更新倒數時間、通過 null 才能執行更新計時器 (只有在"第一次點擊賽事"及"更新倒數計時器完成"後，才會是 null)
                this.updateInfoTiming = this.updateTime;
                if(this.updateCounter == null) {
                    this.updateInterval('gameInfo');
                }
            } else {
                switch (res.err_msg) {
                    case 10003:
                        alert(this.LangPipe.transform('The game is over! Please re-select the event',this.api.langPackage,undefined));
                        this.gameInfo = [];
                        this.updateGameList();
                        /**
                         * 尚未做的部分
                         * 當 List 觸發賽事關盤，而該賽事正在 table 開啟時(table 還沒觸發)，通知 table 關盤
                         */
                        break;
                    case 10002:
                        //不該發生: 表示 list 有，但 table 不存在，跟後端反應
                        alert(this.LangPipe.transform('Wrong choice of event! Please reselect event',this.api.langPackage,undefined));
                        this.updateGameList();
                        break;
                    case 10001:
                        //不該發生: 可能在抓取 URL 的 /:type 有問題
                        alert(this.LangPipe.transform('Wrong input',this.api.langPackage,undefined));
                        this.updateGameList();
                    default:
                        break;
                }

            }
        })
    }
    /**
     * 點擊下注，傳送下注資料給 globals -> app -> bet-dialog
     */
     betRegister(_gameItem: any ={}, _gamePtype: string, _gameOdds: any ={}) {
        this.globals.betInfo = {
            'gtype'  : this.gtype,
            'ptype'  : _gamePtype,
            'lid'    : _gameItem.lid,
            'gid'    : _gameItem.gid,
            'ht'     : _gameItem.ht,
            'ct'     : _gameItem.ct,
            'date'   : _gameItem._gdate,
            'gtime'  : _gameItem._gtime,
            'option' : _gameOdds.option,
            'win'    : _gameOdds.win,
            'score'  : _gameOdds.score,
            'trade'  : _gameOdds.trade
        };
     }
    /**
     * 更新倒數計時器
     */
    updateInterval(updateOption: string) {
        switch(updateOption) {
            case 'gameInfo':
                this.updateCounter = setInterval(() => {
                    this.updateInfoTiming--;
                    //倒數完畢執行更新
                    if(this.updateInfoTiming === 0) {
                        this.updateGameInfo();
                    }
                }, 1000);
                break;
            case 'gameList':
                this.updateListTiming = this.updateTime;
                this.updateLisCounter = setInterval(() => {
                    this.updateListTiming--;
                    //倒數完畢執行更新
                    if(this.updateListTiming === 0) {
                        this.updateGameList();
                    }
                }, 1000);
                break;
        }
    }

    /**
     * 更新賽事列表
     */
    updateGameList() {
        this.gamelistSub.unsubscribe();
        this.getGameList();
        this.updateListTiming = this.updateTime;
    }
    /**
     * 更新賽事賠率表 (更新倒數計時 or 點擊更新 驅動)
     */
    updateGameInfo() {
        this.updateGame = new Promise((resolve) => {
            //結束更新倒數計時器
            clearInterval(this.updateCounter);
            //重設更新倒數時間
            this.updateInfoTiming = this.updateTime;
            //通過 null 才能再次執行計時器
            this.updateCounter = null;
            //取消賽賠率表訂閱後，再呼叫取得賽事賠率表
            this.gameInfoSub.unsubscribe();
            this.getGameInfo(this.gameItem);
            resolve();
        });
    }
    /**
     * 賽事列表切換按鈕
     * @param btnPort 按鈕種類根據
     * @param btnPortSub1 子按鈕種類根據
     */
    switchList(btnPort: string, btnPortSub1: string) {
        //"按鈕"與"根據"不同，設定"根據"給"按鈕"
        //"按鈕"與"根據"相同，表示點選子按鈕、設定"子根據"給"子按鈕"
        switch (true) {
            case this.switchButton[0] != btnPort:
                this.switchButton[0] = btnPort;
                this.switchButton[1] = '';
                //console.log('on 父按鈕');
                break;
            case this.switchButton[0] == btnPort && btnPortSub1 == 'father':
                this.switchButton[0] = '';
                this.switchButton[1] = '';
                //console.log('off 父按鈕');
                break;
            case this.switchButton[0] == btnPort && this.switchButton[1] != btnPortSub1:
                this.switchButton[1] = btnPortSub1;
                //console.log('on 子按鈕');
                break;
            case this.switchButton[0] == btnPort && btnPortSub1 != 'father':
                this.switchButton[1] = '';
                //console.log('off 子按鈕');
                break;
            default:
                break;
        }
    }
	/**
	 * 傳給 globals setBetInfo 的訊息
	 * @param msg 傳給 globals setBetInfo 的訊息
	 */
	appDialogOn(msg: any[]) {
		switch (msg[0]) {
			case 'closeDialog':
				//關閉下注視窗 (關閉 <bet-dialog> 視窗)
				this.globals.betInfo = false;
				break;
			case 'closeAndUpdate': //下注後 關閉下注成功資訊
				//通知更新 game table (bet-dialog -> app -> golbal -> game-table)
				this.updateGameInfo();
				//關閉下注視窗 (關閉 <bet-dialog> 視窗)
				this.globals.betInfo = false;
				break;
			case 'updateTable':  //下注後回傳失敗
				//通知更新 game table (bet-dialog -> app -> golbal -> game-table)
				this.updateGameInfo();
				break;
			default:
				break;
		}
	}
    changePage(name: string[]) {
        this.globals.goPage(name);
	}
    ngOnDestroy() {
        this.newDetailsSub.unsubscribe();
       // this.langPackageSub.unsubscribe();
        clearInterval(this.updateLisCounter);
        clearInterval(this.updateCounter);
        clearInterval(this.gameListBack);
    }
}