import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, GlobalService} from 'service';
import { Observable,Subscription } from 'rxjs';

@Component({
    selector: 'betrecord',
    templateUrl: 'betrecord.component.html'
})
export class betRecordComponent implements OnInit, OnDestroy {


    constructor(public api: ApiService,private globals: GlobalService) { }
    record: any ;
    ngOnInit() { 
      this.getRecord();
    }
    getRecord() {
        let req = { 'uid': this.globals.getNowUid() ,'web': 'y'};
        this.api.postServer(961, req).subscribe(apiRes => {
          if (!apiRes.err) { return; }
          this.record = apiRes.ret;
        })
      }
    ngOnDestroy() {

    }
}