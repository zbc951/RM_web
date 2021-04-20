import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { configData } from 'lib/config';
import { ResponseData } from 'lib/IResponse';
import { Router } from '@angular/router';
import { GlobalService } from 'service/global.service';
@Injectable()
export class ApiService {
	/*
	錯誤代碼列表
	公用obj
	 */
	public errdata :any ={};
	public langPackage : any = {};
	public ChinaArea : any = {};
	constructor(private http: Http, private router: Router, private globals: GlobalService) { 

		//取得錯誤對照清單
        // http.get('./file/errList.json').map(res => res.json()).subscribe(
		// 	data => this.errdata = data,
		// 	err => console.log('errdata-err'),
		// 	() => console.log('Got response from errdataAPI errList')
		//   );
		  

		//
		this.checkLang();
		switch (this.globals.getNowLang()) {
            case "zh-tw" :
				this.http.get('./file/errMsg-tw.json')
				.map(res => res.json()).subscribe(
					data => this.errdata = data,
					err => console.log('errMsg-tw'),
					() => console.log('Got response from errdataAPI errMsg-tw')
				  );
                break;
				case "zh-cn" :
				this.http.get('./file/errMsg-cn.json')
				.map(res => res.json()).subscribe(
					data => this.errdata = data,
					err => console.log('errMsg-cn'),
					() => console.log('Got response from errdataAPI errMsg-cn')
				  );
                break;
			case "en-us" :
				this.http.get('./file/errMsg-en.json')
				.map(res => res.json()).subscribe(
					data => this.errdata = data,
					err => console.log('errMsg-en'),
					() => console.log('Got response from errdataAPI errMsg-en')
				  );
                break;
            default:
                break;
        }
		let langFile = "";
		switch(this.globals.getNowLang()){
			case "zh-tw" :
				langFile = './file/zh-tw.json';
				break;
			case "zh-cn" :
				langFile = './file/zh-cn.json';
				break;
			case "en-us" :
				langFile = './file/zh-tw.json';
				break;
		}
		//取得語言對照清單
		http.get(langFile).map(res => res.json()).subscribe(
			data => this.langPackage = data,
			err => console.log(err),
			() => console.log('Got response from errdataAPI langFile')
		);
		//取得地區對照清單
		http.get('./file/ChinaArea.json').map(res => res.json()).subscribe(
			data => this.ChinaArea = data,
			err => console.log('errdata-err'),
			() => console.log('Got response from errdataAPI ChinaArea')
		);
		
		var getData = location.search.slice(1).split('=');
		if(getData[0] == "user_key"){
			// location.href = location.href.slice(0,location.href.indexOf("?"));
			this.postServer(996, {"user_key": getData[1]}).subscribe(res => {
				if(!res.err){
					console.log("ichat->user_key",res);
					switch(res.err_msg){
						case 99601:
							this.globals.showAutoLogin = {type: 'noBind_noRegister', title : "自动登入失败", data : "请绑定或注册帐号"};
							break;
						case 99602:
							this.globals.showAutoLogin = {type: 'noRegister', title : "自动登入失败", data : "请注册帐号"};
							break;
						default:
							this.globals.showAutoLogin = {type: 'Error', title : "自动登入失败", data : "请重新登入或连系客服"};
							if(this.errdata[res.err_msg] != null) {
								alert(this.errdata[res.err_msg]);
								return;
							}
							alert(res.err_msg);
					}
					return;
				}
				let data = res.ret;
				console.log(12333333333);
				//設定會員資料
				sessionStorage.setItem('uid', data.uid);
				// sessionStorage.setItem('username', data.username);
				this.globals.showAutoLogin = {type: 'successful', title : "自动登入中", data : "请稍后..."};
				location.href = location.href.slice(0,location.href.indexOf("?"));
			});
		}
	}
	/**
	 * api路徑
	 */
	private APIpath = configData.gateway;
	/**
	 *轉序列化，去除多餘符號
	 * @param data 序列化值
	 */
	private formatData(_data: any) {
		let returnData = '';
		let count = 0;
		for (let i in _data) {
			if (count == 0) {
				returnData += i + '=' + _data[i];
			} else {
				returnData += '&' + i + '=' + _data[i];
			}
			count = count + 1;
		}
		return returnData;
	}
	/**
	 * api 
	 * @param _code gateway編號
	 * @param _data 參數
	 */
	postServer(_code: number, _data?: any): Observable<ResponseData> {
		if(!_data['lang']){
			_data['lang'] = this.globals.getNowLang();
		}
		let endpoint = this.APIpath+'?'+_code;//路徑
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' });
		let options = new RequestOptions({ headers: headers });//協定
		let body = this.formatData({
			cmd: JSON.stringify({
				cmd: _code,
				parame: _data //parame
			})//傳值
		});
		return this.http
			.post(endpoint, body, options)
			.retry(2)
			.timeout(30000)
			.map((res: Response) => {
				let body: ResponseData = eval('(' + res["_body"] + ')');
				body['cmd'] = _code;
				if (!body.err) { this.errReturn(_code,body.err_msg); } //如果錯誤true
				return body || {};
			})
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}
	/**
	 * 測試用api function
	 * @param _code gateway編號
	 * @param _data 參數
	 */
	getFakeData(_code: number, _data?: any): Observable<ResponseData> {
		return this.http
			.get('./file/fake/' + _code + '.json')
			.map(res => {
				let test: ResponseData = { 'err': true, 'err_msg': 0, 'ret': res.json() };
				if (test.err_msg == 700 && !test.err) {
					alert(test.err_msg);
					sessionStorage.removeItem('uid');
            		sessionStorage.removeItem('username');
					this.router.navigate(['main']);
					this.globals.setShowLogin(true);
				}
				return test || {};
			})
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}
	/**
	 * 處理錯誤對照表
	 * @param _code 代碼
	 */
	errReturn(_code: number,_err_msg:any) {
		if(_code == 996 || _code == 993 || _code == 333){
			return;
		}
		if(this.errdata[_err_msg] == null) {
			alert(_err_msg);
			return;
		}
		// console.log(_code,_err_msg,this.errdata[_err_msg]);
		//跑馬燈 資料為空 直接return
		if(_code == 810){
			return;
		}
		alert(this.errdata[_err_msg]);
		//       700驗證過期 &&   990 登出
		if (_err_msg == 700 && _code != 990 ) {
		
			sessionStorage.removeItem('uid');
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('Logout');
			this.globals.backTimeSub.unsubscribe();
			this.globals.betInfo = false;
			this.globals.serviceInfo = false;
			this.router.navigate(['main']);
			this.globals.setShowLogin(true);

			return;
		}
		//     310 下注 || 130 賠率表
		if(_code == 310 || 130){
			return;
		}
		console.log('err:'+_code);
		console.log(this.errdata[_err_msg]);
	}

	checkLang(){
		//手機無痕模式或未登錄
		if(sessionStorage.getItem("lang") == undefined){
			//未登錄
			if(location.search.indexOf("?") == -1 || location.search.indexOf("?user_key") > -1){
				try{
					sessionStorage.setItem("lang",configData.lang);
					this.globals.setNowLang(configData.lang);
					// throw new Error("123");
				}catch(e){
					//
					// console.log(e);
					// alert("index.html?" + configData.lang);
					location.href = "index.html?" + configData.lang;
					return;
					// document.location.href = 'index.html?' + configData.lang;
				}
			}else{
				//手機無痕重新整理
				this.globals.setNowLang(this.getUrlKey()[0]);
			}	
		}else{
			// // 已登錄
			// alert(3+"\n"+sessionStorage.getItem("lang"));
			this.globals.setNowLang(sessionStorage.getItem("lang"));
		}
	}

	checkUid(){
		if(location.search.indexOf("?") > -1 && location.search.indexOf("?user_key") == -1){
			let uid = this.getUrlKey()[1];
			if(uid)	this.globals.setNowUid(uid);
		}else{
			if(sessionStorage.getItem('uid')) this.globals.setNowUid(sessionStorage.getItem('uid'));
		}
	}
	//重新整理和做存提款會呼叫
	getIchatInfo(theUid : string){
		this.postServer(993, {uid:theUid}).subscribe(res => {
			if(!res.err){
				console.log("ichat->user_key",res);
				return;
			}
			let data = res.ret;
			console.log("ichat->user_key",res);
			this.globals.setIsIchat(data.isIchat);
			this.globals.setIchatUser(data.username);
			this.globals.setIchatBalance(data.balance);
		});
		
	}
		// //登入前gateway抓取的資料 暫存session 資料
		// checkIsIchat(){
		// 	if(sessionStorage.getItem('isIchat')) this.globals.setIsIchat(true);
		// 	if(sessionStorage.getItem('ichatUser')) this.globals.setIchatUser(sessionStorage.getItem('ichatUser'));
		// }
	getUrlKey(){
		return location.search.slice(1).split('?');
	}
	/**
	 * pipe 有個 getLangPipe 是給 html tag 用的
	 * 此function 是給ts 用的
	 */
	getLang(_value) : string{
        let langPackage = this.langPackage;
        if(langPackage == undefined || langPackage[_value] == undefined || this.globals.getNowLang() == "en-us") {
            return _value;
        }
        return langPackage[_value];
    }
}