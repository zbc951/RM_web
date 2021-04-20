import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, GlobalService} from 'service';
import { Observable,Subscription } from 'rxjs';
import { getLangPipe } from '../../app.pipes';
@Component({
    selector: 'record',
    templateUrl: 'record.component.html'
})
export class RecordComponent implements OnInit, OnDestroy {
    /**
     * 預設更新時間
     */
    private defaultUpdateTime : number = 60;
    /**
     * 當前秒數
     */
    public backTime : number = this.defaultUpdateTime;
    /**
     * 總共頁數，預設是第一頁
     */
    public pages : Array<number> = [1];
    /**
     * 選擇後當前頁數
     */
    public selectedPage :number = 1;
    /**
     * 來源資料轉乘的格式
     */
    public sourceData : Array<Object>;
    /**
     * 倒數時間訂閱
     */
    private backTimeSub : Subscription;
    public deposit : number = 0;
    public withdraw : number = 0;
    constructor(public api: ApiService,private globals: GlobalService ,private LangPipe:getLangPipe) { }

    ngOnInit() { 

        this.getRecord();

        this.backTimeSub = Observable.interval(1000).subscribe( () => {
            if(this.backTime == 0 ){
                this.reload();
            }
            this.backTime--;
            // console.log("record",this.backTime);
        } );
    }
    reload(){
        this.getRecord();
        this.backTime = this.defaultUpdateTime;
    }
    getRecord(){
        this.deposit = 0;
        this.withdraw = 0;
        this.pages = [1];
        let para = { uid : this.globals.getNowUid(), page : this.selectedPage};
        this.api.postServer(780, para ).subscribe(res => {
            if(!res.err){
                console.log("存提交易紀錄",res);
                return;
            } 
            let recordData = res.ret;

            if( recordData['list'] == undefined ||  recordData['list'].length == 0){
                this.sourceData = [];
                return;
            }
            this.sourceData = recordData['list'];
            for(let no = 0; no < this.sourceData.length; no++){
                let data = this.sourceData[no];
                switch(data['tab']){
                    case 'dp':
                        data['tab_type'] = this.LangPipe.transform('Deposit',this.api.langPackage,undefined);
                        break;
                    case 'wd':
                        data['tab_type'] = this.LangPipe.transform('Withdraw',this.api.langPackage,undefined);
                        break;
                    case 'pp':
                        data['tab_type'] = this.LangPipe.transform('Third party payment',this.api.langPackage,undefined);
                        break;
                    case 'ichat_error1' :
                        data['tab_type'] = this.LangPipe.transform('no data',this.api.langPackage,undefined);
                        break;
                    case 'ichat_in' :
                        data['tab_type'] = this.LangPipe.transform('Transfer into',this.api.langPackage,undefined);
                        break;
                    case 'ichat_out' :
                        data['tab_type'] = this.LangPipe.transform('Transfer',this.api.langPackage,undefined);
                        break;
                    case 'ichat_error2' :
                        data['tab_type'] = this.LangPipe.transform('error',this.api.langPackage,undefined);
                        break;
                }

                switch(data['progress']){
                    case '0':
                    data['progress_type'] = this.LangPipe.transform('Processing',this.api.langPackage,undefined);
                    break;
                    case '1':
                    data['progress_type'] = this.LangPipe.transform('Complete',this.api.langPackage,undefined);
                    break;
                    case '2':
                    data['progress_type'] = this.LangPipe.transform('Failed',this.api.langPackage,undefined);
                    break;
                }
                switch(data['type']){
                    case '0':
                        switch(data['tab']){
                            case 'ichat_in' :
                                data['type_type'] = "从ichat转入";
                                break;
                            default:
                                data['type_type'] = "柜员机转帐";
                                break;
                        }
                        break;
                    case '1':
                        switch(data['tab']){
                            case 'ichat_out' :
                                data['type_type'] = "转出至ichat";
                                break;
                            default:
                                data['type_type'] = "网银转帐";
                                break;
                        }
                        break;
                    case '2':
                        data['type_type'] = "手机银行转帐";
                        break;
                    case '3':
                        data['type_type'] = "现金柜台转帐";
                        break;
                    default:
                        data['type_type'] = data['type'];
                }
                
            }

            if(recordData['dp']){
                this.deposit += recordData['dp']['totalCredit'];
            }
            if(recordData['pp']){
                this.deposit += recordData['pp']['totalCredit'];
            }
            if(recordData['ichat_in']){
                this.deposit += recordData['ichat_in']['totalCredit'];
            }

            if(recordData['wd']){
              this.withdraw += recordData['wd']['totalCredit'];
            }
            if(recordData['ichat_out']){
                this.withdraw += recordData['ichat_out']['totalCredit'];
            }


                    // 判斷是否增加頁數                
            if(recordData['page'] > 1 ){
                for(let no = 1; no < recordData['page']; no++){
                    this.pages.push(no+1);
                }
            }
        });
    }
    ngOnDestroy() {
        this.backTimeSub.unsubscribe();
    }
}