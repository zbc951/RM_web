import { Component, OnInit } from '@angular/core';
import { GlobalService, ApiService } from 'service';
@Component({
    selector: 'problem',
    templateUrl: 'problem.component.html'
})
/**
 * 問題反應
 */
export class ProblemComponent implements OnInit {
    /**
     * 
     */
    public test : boolean = false; 
    /**
     * 發問紀錄
     */
    public record : Array<any>;
    /**
     * 聯絡方式
     */
    public contact : string;
    /**
     * 問題內容
     */
    public problem : string;
    constructor(private globals: GlobalService, public api: ApiService) { 
    }

    ngOnInit() { 
        this.getProblem();
    }
    getProblem(){
        // 取得發問紀錄
        this.doProblem("dget","","","");
    }
    /**
     * 
     * @param _type  
     *              1. dins  送出問題反應
     *              2. dget  取得發問紀錄
     * @param _contact 
     * @param _problem 
     */
    doProblem(_type : string, _contact : string, _problem : string, _id : string) : any{
        let para =null;
        switch(_type){
            case "dup":
                para = { uid : this.globals.getNowUid(), type : _type, id : _id };
                break;
            default :
                para = { uid : this.globals.getNowUid(), type : _type, contact : _contact, problem : _problem };
        }
        
        this.api.postServer(940, para ).subscribe(res => {
            if(!res.err){
                console.log("問題反應",res);
                return;
            }
            // console.log(1111,res);
            if(_type == "dins" || _type == "dup"){
                return;
            }
            let recordTmp = res.ret;
            if(recordTmp.length == 0 ) return;
            this.record = recordTmp.map((list) => {
                // console.log(list);
                list.toggle = false;
                switch(list.chk){
                    case "0" :
                        list.toggle = false;
                        break;
                    case "1" :
                        list.toggle = true;
                        break;
                }
                return list;
            });
        });
    }
    isRead(_list : any){
        this.doProblem("dup","","",_list.id);
        this.doProblem("dget","","","");
        this.updateMoneyInfo();
    }
    /**
     * 送出問題反應
     */
    onSubmit(){
        // 送出問題反應
        this.doProblem("dins","",this.problem,"");
        // this.doProblem("dins",this.contact,this.problem);
        // 取得發問紀錄
        this.doProblem("dget","","","");
        // this.contact="";
        this.problem="";
    }
    /**
     * 更新 問與答的筆數
     */
    updateMoneyInfo(){
         this.api.postServer(965, { uid: this.globals.getNowUid() }).subscribe(res => {
            if(!res.err){
                console.log("login->更新金額",res);                            
                return;
            } 
            let moneyData = res.ret;
            this.globals.moneyInfoBridge(moneyData);
        });
    }
}