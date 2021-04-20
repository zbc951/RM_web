import { Component, OnInit, EventEmitter ,Output} from '@angular/core';
import { GlobalService, ApiService } from 'service';
import { Subscription } from 'rxjs';
import { ActivatedRoute ,Router} from '@angular/router';
import { p_id} from 'lib/config';
@Component({
    selector: 'discount',
    templateUrl: 'discount.component.html'
})
/**
 * 公告主頁面 
 */
export class DiscountComponent implements OnInit {


    constructor( public route:ActivatedRoute , public api: ApiService) { }
    open: any =[false,false,false,false,false,false,false  ];
    P_ID=p_id;

    @Output() Discount = new EventEmitter();
    ngOnInit() {
        console.log(this.route.snapshot.url[0].path);
     }
     toreturn(){
        this.Discount.emit(true);
     }
}