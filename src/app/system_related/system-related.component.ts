import { Component} from '@angular/core';
import { GlobalService,ApiService } from 'service';
@Component({
    selector: 'system-related',
    templateUrl: 'system-related.component.html'
})
/**
 * 主頁面中間的頁面 既是首頁
 */
export class SystemRelatedComponent  {
    /**
     * 當前選擇項目  預設是規則說明
     */
    public selectItem : string = "rules";
    constructor(public globals: GlobalService,public api: ApiService) { }
    /**
     * 選擇後的變更設定
     */
    changeSelectItem(_item: string):void{
        this.selectItem=_item;
    }
}