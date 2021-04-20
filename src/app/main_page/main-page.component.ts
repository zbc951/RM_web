import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { getLangPipe } from '../app.pipes';
@Component({
    selector: 'main_page',
    templateUrl: 'main-page.component.html'
})
/**
 * 主頁面中間的頁面 既是首頁
 */
export class MainPageComponent implements OnInit {
     /**
	 * 帳號
	 */
    public bind_username: string = '';
	/**
	 * 密碼
	 */
    public bind_password: string = '';

    constructor(public globals: GlobalService, public api: ApiService,private LangPipe:getLangPipe) { }

    Discount = true;
    open: any =[false,false ];
    ngOnInit() { }
    doLogin(gateway,parameter){
        if(gateway == 995 && (this.bind_username.trim() == "" || this.bind_password.trim() == "")){
            alert(this.LangPipe.transform('Please enter the complete account password',this.api.langPackage,undefined));
            return;
        }
        this.api.postServer(gateway,parameter).subscribe(res => {
            if(!res.err){
                console.log("登入",res);
                return;
            } 
            let data = res.ret;
            if(data.uid){
                if(location.search.indexOf("?") > -1 && location.search.indexOf("?user_key") == -1){
                    location.href = location.href.replace("?"+this.globals.getNowLang(),"?"+this.globals.getNowLang()+"?"+data.uid);
                    return;
                }
                sessionStorage.setItem('uid', data.uid);
                sessionStorage.setItem('username', data.username);
                //防止NETWORK 留著gateway 999資料
                location.href = location.href.slice(0,location.href.indexOf("?"));
            }
        });
    }
    /**接收discount的Output */
    toDiscount(_val){
        this.Discount = _val;
    }

    ichatLogin(){
        this.globals.showAutoLogin = {type: 'bind_login', title : "绑定STG帐号", data : ""};
    }
    closeDialog() {
        location.href = location.href.slice(0,location.href.indexOf("?"));
    }
}