
export function gettime(){
    
	let now = new Date(); 									//當前日期  
	let nowDayOfWeek = now.getDay(); 						//今天本周的第幾天 
	let nowDay = now.getDate(); 							//當前日   
	let nowMonth = now.getMonth(); 							//當前月   
	let nowYear = now.getFullYear(); 							//當前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

    let formatDate =function (date) {   
        let myyear = date.getFullYear();   
        let mymonth = date.getMonth() + 1;   
        let myweekday = date.getDate();   
        if (mymonth < 10) {   
            mymonth = "0" + mymonth;   
        }   
        if (myweekday < 10) {   
            myweekday = "0" + myweekday;   
        }   
        return (myyear + "-" + mymonth + "-" + myweekday);   
    }
    
    //獲得本周的開端日期
    let weekStartDate = formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1));   

    //獲得本周的停止日期 
    let weekEndDate = formatDate(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek+1)));   

    //獲得上周的開端日期
    let lastWeekStartDate =formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7+1)) ;   
  
    //獲得上周的停止日期 
    let lastWeekEndDate =formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1+1)) ;   
    //獲得本月的第一天 
    now = new Date();
    now.setDate(1);
    let monthStartDate =formatDate(now);
    //本月最後一天
    now = new Date();
    now.setMonth(now.getMonth()+1);
    now.setDate(1);
    now.setDate(now.getDate()-1);
    let monthEndDate =formatDate(now);      
    //上個月第一天
    now = new Date();
    now.setMonth(now.getMonth()-1);
    now.setDate(1);
    let lastMonthStartDate =formatDate(now);
    //上個月最後一天
    now = new Date();
    now.setDate(1);
    now.setDate(now.getDate()-1);
    let lastMonthEndDate =formatDate(now);
    // console.log("monthStartDate",monthStartDate,"monthEndDate",monthEndDate,"lastMonthStartDate",lastMonthStartDate,"lastMonthEndDate",lastMonthEndDate);
    // https://chou7658.blogspot.tw/2014/12/javascript.html



    return{
        weekStartDate      : weekStartDate,
        weekEndDate        : weekEndDate,
        lastWeekStartDate  : lastWeekStartDate,
        lastWeekEndDate    : lastWeekEndDate,
        monthStartDate     : monthStartDate,
        monthEndDate       : monthEndDate,
        lastMonthStartDate : lastMonthStartDate,
        lastMonthEndDate   : lastMonthEndDate
    };
  
}

export function gameInfoOptionToShow(_gameInfo : any) : any{
    _gameInfo.map(item => {
        item.table.map(list => {
            let score = list.option;

            //上半場波膽不顯示
            if(item.ptype == "PDHR"){
                if(list.option == "H0C3"){
                    list.score = "Visiting > 3";
                    return list;
                }
                if(list.option == "H3C0"){
                    list.score = "Home > 3";
                    return list;
                }
                // if(list.option == "H3C0"){
                //     list.score = "Other";
                //     return list;
                // }
                if(list.option == "H0C3" || list.option == "H1C3" || list.option == "H3C1" || list.option == "H2C3" || list.option == "H3C2" || 
                   list.option == "H3C3" || list.option == "OVH" || list.option == "OVC"){
                    list.enable = false;
                    list.score = "";
                    return list;
                }
            }

            if(score == "OVH" || score == "OVC"){
                if(score == "OVH") {
                    list.score="Home > 4";
                }
                if(score == "OVC") {
                    list.score="Visiting > 4";
                }
                return list;
            }
            list.score=score.replace("H", "").replace("C", "-");
            return list;
        });

        //由小到大排序
        item.table.sort(function(a,b) {
            // if(){}
            let a_value = a.score.replace("-", "");
            let b_value = b.score.replace("-", "");
            if(a_value ==""  ){
                a_value = 1002;
            }
            if(b_value =="" ){
                b_value = 1002;
            }


            if(a_value =="Home > 4"){
                a_value = 1000;
            }
            if(b_value =="Home > 4"){
                b_value = 1000;
            }
            if(a_value =="Visiting > 4"){
                a_value = 1001;
            }
            if(b_value =="Visiting > 4"){
                b_value = 1001;
            }




            if(a_value =="Visiting > 3"){
                a_value = 998;
            }
            if(b_value =="Visiting > 3"){
                b_value = 998;
            }
            if(a_value =="Home > 3"){
                a_value = 997;
            }
            if(b_value =="Home > 3"){
                b_value = 997;
            }
            return a_value - b_value;
        });
        return item;
    });
    return _gameInfo;
}

export function betRecordOptionToShow(_gameInfo : any) : any{
    // console.log(_gameInfo);
    _gameInfo.map(item => {
        let score = item.option;
        if(score == "OVH" || score == "OVC"){
            if(score == "OVH") {
                item.score="Home > 4";
            }
            if(score == "OVC") {
                item.score="Visiting > 4";
            }
            return item;
        }
        item.score=score.replace("H", "").replace("C", "-");

        if(item.lid2 == "上半" && item.score == "3-0" ) {
            item.score = "Other";
        }

        return item;
    });
    return _gameInfo;
}