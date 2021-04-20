import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GlobalService, ApiService } from 'service';
import { Observable, Subscription } from 'rxjs';
import { getLangPipe } from '../../app.pipes';
@Component({
    selector: 'bet-dialog',
    templateUrl: 'bet-dialog.component.html'
})
export class BetDialogComponent implements OnInit, OnDestroy  {
    constructor(public globals: GlobalService, public api: ApiService,private LangPipe:getLangPipe) {}
    @Input() betInfo: any;
    /**下注跳出視窗事件 */
    @Output() dialogEmit = new EventEmitter();
    /**下注欄位 控制器 ts*/
    public betGoldInputControl = new FormControl();
    /**下注欄位控制器 訂閱 ts*/
    private betGoldInputControlSub = new Subscription();
    /**點擊視窗黑色部分 訂閱 ts*/
    private outsideDialogSub = new Subscription();
    /**會員下注餘額 ts*/
    private memberSurplus : any;
    /**下注金額填寫欄位 html*/
    public inputGold: number;
    /**會員自定義下注金額 ts html*/
    public memberGoldSet: Array<string> = ["100","1000","10000"];
    /**下注成功明細 (預設 false 使視窗關閉) ts html*/
    public betSucDetail: any = false;
    /**快速下注按鈕 ts html*/
    public btnSetQuickGold: boolean = true;
    /**確定交易按鈕 ts html*/
    public btnBetRequest: boolean = true;
    /**下注錯誤訊息 ts html*/
    public erroMsg: string;

    /**對話框動畫狀態 ts html*/
    public dialogAnimate: string = 'out';
    /**
     * 金額資訊訂閱
     */
    private moneyInfoSub : Subscription;
    ngOnInit() {

        this.moneyInfoSub = this.globals.moneyInfo$.subscribe(( res : any ) => {
            //取得會員設定
            this.memberSurplus = res.surplus;
		});
        this.getMemberData(this.globals.getNowUid());
        this.inputControl();
        this.closeDialogDOM();

    }
    /**
     * 透過 gateway 960 取得會員資料
     * @param _uid
     */
    getMemberData(_uid:string):void{
        this.api.postServer(960, { uid: _uid }).subscribe(res => {
            if(!res.err){
                console.log("bet-dialog->會員資料",res);
                return;
            } 
            //設定會員資料
            let memberData = res.ret;
            //快速下注
            this.memberGoldSet = memberData.info.goldset.split(",");
            //第一次先取得會員資料，把資料丟入串流 讓帳戶餘額、會員中心的個人資料也會更新
            this.globals.moneyInfoBridge(memberData);
        });
    }
    /**
     * 點確認下注，做下注請求 gateway 310
     * @param betData 下注資訊
     */
    betRequest(betData, inputGold) {
        // console.log(betData,inputGold,100 <= inputGold , inputGold <= this.memberSurplus);
        if( 100 <= inputGold && inputGold <= this.memberSurplus) {
            //取得資料前，關閉按鈕 (避免重新點選、連按)
            this.btnBetRequest = false;
            this.erroMsg = this.api.getLang('Please wait for a moment');  //下注中请稍后...
            //下注請求後，停用點選黑色部分而關閉
            this.outsideDialogSub.unsubscribe();

            //請求下注 gateway 310
            let req = { uid: this.globals.getNowUid(), gtype: betData.gtype, gid: betData.gid,
                        gold: inputGold, ptype: betData.ptype, option: betData.option, win: betData.win/100 };

            this.api.postServer(310, req).subscribe((res) => {
                //下注請求成功
                if(res.err === true) {
                    let resBetSuc = res.ret;
                    if(resBetSuc) {
                        //更新金額資訊 (餘額)，讓右上角餘額更新
                        this.api.postServer(965, { uid: this.globals.getNowUid() }).subscribe((resM) => {
                            if(!res.err){
                                console.log("bet-dialo->更新金額",res);
                                return;
                            } 
                            this.globals.moneyInfoBridge(resM.ret);
                        });
                        //下注成功後 更新下注明細
                        let parameter = { uid: this.globals.getNowUid(), lang: this.globals.getNowLang() };
                        this.api.postServer(650, parameter).subscribe(res => {
                            if(!res.err){
                                console.log("下注明細",res);
                                return;
                            }
                            //第一次先取得最新注單，把資料丟入串流 讓資料更新
                            this.globals.newDatailsBridge(res);
                        });

                        //下注資訊增加"單號(bid)"、"預期獲利(est_win)"、"下注金額(gold)"欄位
                        betData.bid = resBetSuc.bid;
                        betData.est_win = this.winForecastCal(inputGold, betData.win);
                        betData.gold = inputGold;
                        // console.log("betData",betData);
                        //將 下注資訊 傳給 下注成功明細 (有資料就會打開下注成功頁面)
                        this.betSucDetail = betData;
                        this.betSucDetail['date'] = this.betInfo.date;
                        this.betSucDetail['gtime'] = this.betInfo.gtime;
                        //關閉下注頁面
                        this.betInfo = false;
                        //清空提示訊息
                        this.erroMsg = '';
                        //下注請求成功，啟用點選黑色部分而打開
                        this.closeDialogDOM();
                    }
                } else {
                    //下注請求失敗，打開確定交易按鈕、重設提示訊息
                    this.btnBetRequest = true;
                    this.betGoldInputControl.enable();
                    this.erroMsg = '';
                    //下注請求失敗，啟用點選黑色部分而關閉
                    this.closeDialogDOM();
                    switch (res.err_msg) {
                        case 31001:
                            //表示 API 傳送錯誤，檢查程式
                            this.closeDialog('updateTable');  //關閉下注頁並更新table
                            alert(this.LangPipe.transform('Match error',this.api.langPackage,undefined));
                            break;
                        case 31002:
                            this.erroMsg = this.api.getLang('The bet amount exceeds the trading volume limit'); //下注金額「超過」該場限額
                            this.dialogEmit.emit('updateTable');    //通知 app 告知 game-table 更新
                            break;
                        case 31003:
                            //input 有設定 min=100、前面程式有做 if 判斷，基本上不會發生
                            this.erroMsg = this.api.getLang('Bet amount is less than 100'); //下注金額「低於」100'
                            break;
                        case 31004:case '31004':
                            //賽事關盤回到選擇賽事畫面、重load
                            alert(this.LangPipe.transform('Event closed',this.api.langPackage,undefined)+'!');
                            location.reload();
                            break;
                        case 31005:
                            //賽事停押、但還是看得到賽事
                            this.closeDialog('updateTable');  //關閉下注頁並更新table
                            alert(this.LangPipe.transform('The match has been suspended',this.api.langPackage,undefined)+'!');
                            break;
                        case 31006:
                            this.betInfo.win = res.ret;     //獲利變更，更新新的獲利
                            this.erroMsg = this.api.getLang('The game profit change!'); //賽事獲利變更!
                            break;
                        case 31007:
                            //前面有做 if 判斷，基本上不會發生
                            this.erroMsg = this.api.getLang('Insufficient account balance! Please re-bet'); //"帳戶餘額不足! 請重新下注"
                            break;
                        default:
                            this.closeDialog('updateTable');
                            alert(res.err_msg);
                            break;
                    }
                }
            })
        } else {
            if(inputGold > this.memberSurplus) {
                //關閉下注input控制器，以顯示警告訊息
                this.betGoldInputControlSub.unsubscribe();
                this.erroMsg = this.api.getLang('Insufficient account balance! Please re-bet'); //"帳戶餘額不足! 請重新下注"
                //重新啟用下注input控制器
                setTimeout(()=>{
                    this.inputControl();
                },500);
            } else if(100 > inputGold) {
                //input 有設定 min=100，基本上不會發生
                this.erroMsg = this.api.getLang('Bet amount is less than 100'); //下注金額「低於」100'
            }
        }
    }
    /**控制 input 控制器*/
    inputControl() {
        this.betGoldInputControlSub = this.betGoldInputControl.valueChanges
          //  .debounceTime(300)  延遲0.3秒
            .subscribe((inputGold) => {
                this.erroMsg = '';
                if(inputGold < 100 && inputGold != null) { this.erroMsg = this.api.getLang('*The minimum bet amount is 100'); } //*最低下注金額為 100
                else if(inputGold > this.memberSurplus) { this.erroMsg = this.api.getLang("*The bet amount exceeds the balance"); } //*下注金額超過餘額
                else if(inputGold > this.betInfo.trade) { this.erroMsg = this.api.getLang("*The bet amount exceeds the trading volume limit"); } //*下注金額超過可交易量
            });
    }
    /**
     * 預計獲利計算
     * @param gold 下注金額
     * @param win 獲利%
     */
    winForecastCal(gold , win ) {
        return ( (gold * win / 100) - (gold * win / 100) * 0.05 ).toFixed(2);
    }
    /**
     * 快速下注設定 gateway 950
     */
    SetQuickGold(setGold1: string, setGold2: string, setGold3: string) {
        //關閉快速下注設定、打開快速下注
        this.btnSetQuickGold = true;
        let setGold = setGold1 + ',' + setGold2 + ',' + setGold3;
        let req = { uid: this.globals.getNowUid(), gold: setGold };
        //快速下注設定 gateway 950
        this.api.postServer(950, req).subscribe();
    }
    /**
     * 關閉下注頁面 bet-dialog html，並通知 app 關閉 <bet-dialog>
     */
    closeDialog(msg) {
        // //關閉下注頁面 (關閉 bet-dialog html 而非 app <bet-dialog>)
        // this.betInfo = false;
        //關閉下注成功頁面
        this.betSucDetail = false;
        //通知 app 要做的事件
        this.dialogEmit.emit(msg);
    }
    /**點擊黑色半透明區塊，關閉 bet-dialog html */
    closeDialogDOM() {
        const dialogMainDOM = document.getElementsByClassName('bet_dialog');
        const mouseDown = Observable.fromEvent(dialogMainDOM, 'mousedown');
        //如果點選到的是 <main class="bet_dialog"> 的區域，關閉 bet-dialog html
        this.outsideDialogSub = mouseDown.filter(event => event['target']['className'] === 'bet_dialog')
                                         .subscribe(() => this.closeDialog(['closeDialog']) );
    }

    calculationGold(inputGold : number, memberGoldSet : string) : number{
        if(inputGold == undefined){ 
            inputGold = 0;
        }
        return (inputGold + Number(memberGoldSet));
    }
    calculationALLIN(_betInfo: any ={}) : number{
        // console.log(_betInfo);
        // console.log(this.memberSurplus , _betInfo.trade,this.memberSurplus > _betInfo.trade);
        if(this.memberSurplus > _betInfo.trade) {

            return _betInfo.trade;
        }
        return this.memberSurplus;
    }
    ngOnDestroy(){
        this.moneyInfoSub.unsubscribe();
    }
}