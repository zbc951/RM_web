import { Component, OnInit } from '@angular/core';
import { ApiService ,GlobalService } from 'service';
import { Subscription } from 'rxjs';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'my-app',
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
	url: SafeResourceUrl;
	token = false;
	private marqueeInfoSub: Subscription;
	constructor(private api: ApiService ,
		public globals: GlobalService,
		public sanitizer: DomSanitizer) { 
			let token_url =  sessionStorage.getItem('token');
            this.url = sanitizer.bypassSecurityTrustResourceUrl(token_url);
		}

	ngOnInit() {
		this.marqueeInfoSub = this.globals.open_token$.subscribe(( res : any ) => {
		   console.log(res);
		   this.token = res;
        });
	}
	
}



