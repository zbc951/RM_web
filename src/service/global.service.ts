import { Injectable } from '@angular/core';
import { Subject,Subscription } from 'rxjs';
import { configData, openWin, scoreLink, onlineLink, registUrl} from 'lib/config';
import { Router } from '@angular/router';

@Injectable()
export class GlobalService {

	constructor(private router: Router) { }
	public showAutoLogin : any = false;
	/**
     * 取得當前 uid
     */
    private nowUid : string;

	/**
     * 取得當前語言 
     */
	private nowLang : string;
	/**
	 *是ichat會員
	 */
	private isIchat : any = false;
	/**
	 *是ichat會員
	 */
	private ichatUser : string;
	private ichatDalance :any;
	/**
	 * 2017 11 08 改由後端給連結
	 * 一開始登入呼叫960，設定存款支付平台連結參數，透過 setDepositUrl() 方法設定值
	 */
	private depositUrl : string;
	/**
	 * 讓 api.service 能夠取消 在 LoginComponent 的倒數訂閱
	 */
	public backTimeSub : Subscription;
	/**
	 * 被強制登出後，讓api 能自動關閉
	 * 客服專區 dialog  input parameter
	 */
	public serviceInfo : any;
	/**
	 * 被強制登出後，讓api 能自動關閉
	 * 下注 dialog  input parameter
	 */
	public betInfo : any;
	/**
	 * 預設登入後顯示球種
	 */
	private defaultBallType : string = configData.defaultBallType;
	/**
	 * 是否顯示login頁面 ，default value=true
	 */
	private showLogin : boolean = true;
	/**
	 * 是否顯示logout按鈕 ，default value=false
	 * 如果是用API登入不顯示登出鑑
	 */
	private showLogout : boolean = false;
	/**
	 * 選擇當前 page
	 */
	private selectRouterItem : string = "";

	/**
	 * 金額資訊 來源 ( _header、user_data 使用)
	 */
	private moneyInfo = new Subject<Object>();
	/**
	 * 金額資訊 可觀察串流 ( _header、user_data 使用)
	 */
	moneyInfo$ = this.moneyInfo.asObservable();
	/**
	 * 下注資訊 來源 By. Ian
	 */
	private marqueeInfo= new Subject<Object>();
	/**
	 * 下注資訊 可觀察串流 By. Ian
	 */
	marqueeInfo$ = this.marqueeInfo.asObservable();

		/**
	 * 下注明細 來源 By. Ian
	 */
	private newDetails= new Subject<Object>();
	/**
	 * 下注明細 可觀察串流 By. Ian
	 */
	newDetails$ = this.newDetails.asObservable();

	private token= new Subject<Object>();
	open_token$  = this.token.asObservable();

	/**
	 * 設定當前uid
	 */
	setNowUid(_uid : string) : string{
		return this.nowUid = _uid;
	}
	
	/**
	 * 取當前uid
	 */
	getNowUid() : string{
		return this.nowUid;
	}
	/**
	 * 設定當前語言
	 */
	setNowLang(_lang : string) : string{
		return this.nowLang = _lang;
	}
	
	setToken(value : any){
		this.token.next(value);
	}
	/**
	 * 取當前語言
	 */
	getNowLang() : string{
		return this.nowLang;
	}
	/**
	 * 設定 isIchat 變數的值
	 */
	setIchatUser(value : any){
		this.ichatUser = value;
	}
	/**
	 * 取得 isIchat 變數的值
	 */
	getIchatUser(){
		return this.ichatUser;
	}
	/**
	 * 設定 isIchat 變數的值
	 */
	setIsIchat(value : any){
		this.isIchat = value;
	}
	/**
	 * 取得 isIchat 變數的值
	 */
	getIsIchat(){
		return this.isIchat;
	}
	/**
	 * 設定 isIchat 變數的值
	 */
	setIchatBalance(value : any){
		this.ichatDalance = value;
	}
	/**
	 * 取得 isIchat 變數的值
	 */
	getIchatBalance(){
		return this.ichatDalance;
	}
	/**
	 * 2017 11 08 改由後端給連結
	 * 一開始登入呼叫960，設定存款支付平台連結參數
	 */
	setDepositUrl(depositUrl : string) : string{
		return this.depositUrl = depositUrl;
	}
	/**
	 * 銷毀使用者資料
	 */
	destroyUserData() {
		sessionStorage.clear();
		console.log('destory user data');
	}
	/**
	 * 取得當前page
	 * 給 header.component.html 和 login.component.html 使用
	 */
	getSelectRouterItem() : string{
		return this.selectRouterItem;
	}
    /**
	 * 跳轉頁面 By. Ian 修改
	 */
	goPage(pageName: string[]) {
		this.router.navigate(pageName);
		this.selectRouterItem = pageName[0];
	}

	/**
	*	設定 預設球種 值
	*/
	setDefaultBallType(_defaultBallType: string) : void {
		this.defaultBallType = _defaultBallType;
	}
	/**
	*取得 預設球種 值
  	*/
	getDefaultBallType(): string {
		return this.defaultBallType;
	}
	/**
	*	設定 showLogin 值
	*/
	setShowLogin(_showLogin: boolean): void {
		this.showLogin = _showLogin;
	}
	/**
	*	設定 showLogout 值
	*/
	setShowLogout(_showLogout: boolean): void {
		this.showLogout = _showLogout;
	}
	/**
	*取得 showLogin 值
  	*/
	getShowLogin(): boolean {
		return this.showLogin;
	}
	getShowLogout(): boolean {
		return this.showLogout;
	}
	/**
	 * 金額資訊
	 * @param msg
	 */
	moneyInfoBridge(msg: any) {
		//金額資訊給可觀察流 ( _header、user_data 使用)
		this.moneyInfo.next(msg);
	}

	/**
	 * 跑馬燈 與 最新公告 
	 * @param msg
	 */
	marqueeInfoBridge(msg: any) {
		//跑馬燈 與 最新公告 資訊給可觀察流 
		this.marqueeInfo.next(msg);
	}
	/**
	 * 最新注單 
	 * @param msg
	 */
	newDatailsBridge(msg: any) {
		//跑馬燈 與 最新公告 資訊給可觀察流 
		this.newDetails.next(msg);
	}
	/**
	 * 對戰紀錄
	 */
	openBattleRecord(gameID :any){
        window.open(openWin +'?battleRecord='+this.getNowUid()+'?'+this.getNowLang()+'?'+this.getDefaultBallType()+'?'+gameID,
		            '_blank', 'location=yes,fullscreen=yes,status=yes'); 
    }
	/**
     * 即時連結
     */ 
    openScoreLink(){
        window.open(scoreLink, '_blank', 'location=yes,fullscreen=yes,status=yes'); 
    }
	/**
     * 即時連結
     */ 
    openOnlineLink(){
		window.open(onlineLink, '_blank', 'location=yes,fullscreen=yes,status=yes');
		
		// const PANEL = document.getElementById('MEIQIA-PANEL-HOLDER');
		// const iframe = document.getElementById('MEIQIA-IFRAME');
		// const BTN = document.getElementById('MEIQIA-BTN-HOLDER');
		// const pageChat = document.getElementById('MEIQIA-IFRAME');
		// console.log(pageChat);
		// // PANEL.style.left = '0';
		// PANEL.style.zIndex = '2147483647';
		// PANEL.style.visibility = 'visible';
		// iframe.style.display = "block";
		// BTN.style.display = "none";
		// BTN.style.zIndex = "-1";
	}

	openDepositLink(paytype){
		// window.open(depositUrl+"?uid="+this.getNowUid(), '_blank', 'location=yes,fullscreen=yes,status=yes');
		//2017 11 08 改由後端給連結
		window.open(this.depositUrl+"&paytype="+paytype, '_blank', 'location=yes,fullscreen=yes,status=yes');
	}
	/**
     * 即時連結
     */ 
    openLink(link :string,para :string){
        window.open(link, '_blank', para);
	}
	    /**
     * 會員連結
     */ 
    openRegister(){
        window.open(registUrl + "?s=k120sfaaof9487kofae86sogood", '_blank', 'location=yes,fullscreen=yes,status=yes'); 
    }
}