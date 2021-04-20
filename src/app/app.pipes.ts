import { Pipe, PipeTransform} from '@angular/core';
import { GlobalService } from 'service';
/**
 * 過濾所有賽事，以日期分類 或 以聯盟分類 (彈性Pipe) (game-table-component.html) By. Ian
 */
@Pipe({name: 'classifyGameList'})
export class classifyGameListPipe implements PipeTransform {
    //value(所有賽事)、key(所有賽事的key值)、vol(比對的根據)
    transform(value: any, key: string, vol: string): any {
        let res = value.filter((item) => {
            return item[key] == vol;     //如果日期相同才納入陣列
        });
        return res;
    }
}
//1111111111111111
/**
 * 目前採用 第2種方法
 * 1. constructor 內抓語言包 ， 需設 pure: false
 * 2. 呼叫 此pipe 要丟語言包     
 * 3. 預設key 為中文 有語言包時 存到session storage
 */
@Pipe({name: 'getLang'})
export class getLangPipe implements PipeTransform {
    constructor(private globals:GlobalService){}
    transform(value : any,langPackage : any,key:any)  {
        // console.log("pipe",value,langPackage,key);
        if(langPackage == undefined || langPackage[value] == undefined || this.globals.getNowLang() == "en-us") {
            return value;
        }
        if(key != undefined){
            return langPackage[value][key];
        }
        return langPackage[value];
    }
}
/**
 * 金額 取小數後面第二位 之後全部捨去掉
 */
@Pipe({name: 'numberToCash'})
export class numberToCash implements PipeTransform {
    transform(value : any)  {
        // console.log(value,Math.floor(100*100)/100,Math.ceil(-100*100)/100,Math.floor(1.129*100)/100,Math.ceil(-1.129*100)/100);
        if(value < 0){
            return Math.ceil(value*100)/100;
        }
        return Math.floor(value*100)/100;
    }
}
/**
 * 金額 轉換 千位分隔符(加逗號)
 */
@Pipe({name: 'cashAddCommas'})
export class cashAddCommas implements PipeTransform {
    //value 為數字
    transform(value : any)  {
        if(isNaN(value)) {
            // console.log("11","NaN");
            return "";
        }
        //根據`.`作為分隔，將val值轉換成一個數組
        var aIntNum = value.toString().split('.');
        // 整數部分
        var iIntPart = aIntNum[0];
        // 小數部分（傳的值有小數情況之下）
        var iFlootPart = aIntNum.length > 1 ? '.' + aIntNum[1] : '';
        var rgx = /(\d+)(\d{3})/;
        // 如果整數部分位數大於或等於5
        if (iIntPart.length >= 4) {
            // 根據正則要求，將整數部分用逗號每三位分隔
            while (rgx.test(iIntPart)) {
                iIntPart = iIntPart.replace(rgx, '$1' + ',' + '$2');
            }
        }
        return iIntPart + iFlootPart.slice(0, 3);
    }
}

/**
 * 賽事結果 關鍵字查詢
 */
@Pipe({
    name: 'searchFilter'
})
export class SearchFilter implements PipeTransform {
    transform(items: any[], keyWord: any): any {
        if(keyWord == "" ) return items;
        return items.filter(item =>{
           for (let key in item ) {
             if((item[key].toString().indexOf(keyWord) > -1 )){
                return true;
             }
           }
           return false;
        });
    }
}


@Pipe({ name: 'timetos' })
export class timetosPipe implements PipeTransform {

    transform(value: any): any {
        return (Date.now() - Date.parse((value).replace(/-/g, '/'))) <300000;
    }
}


@Pipe({name: 'KeysPipe',
// pure: false
})
export class KeysPipe implements PipeTransform {
  transform(value, args:any =false) : any {
    let keys = [];
    for (let key in value) {
        if(!args){
            keys.push({key: key, value: value[key]});
        }else if(args == key){
            keys.push({key: key, value: value[key]});
        }
     
    }

    return keys;
  }
}