'use strict';
var url = {
	gateway: '../pub/gateway.php',
	lang: 'zh-cn',
	defaultBallType: 'FT',  //預設登入後顯示球種
};

//讀不到外層資料 預設測試
var QQ = '---';
var Platform_id=58;
var  Customer_url='';
// 讀取站台config檔案資料

try {
    QQ = c_QQid;
} catch (e) {}
try {
    Platform_id = P_id;
} catch (e) {}
try {
    Customer_url = C_URL;
} catch (e) {}


// //區分正機 和 測機
// if(location.host.indexOf('sog88.net' ) > -1 ){
// 	//    測機 網址 都有固定  sog88.net 這些字串
// 	var getUrl = "http://big59-web.sog88.net";
// 	var getRegistUrl = "http://big59-web.sog88.net/app/spread/registered.php";
// 	var getOpenWin = "http://big59-web.sog88.net/app/openWin";
// 	// var getDepositUrl = "http://big59-web.sog88.net/app/FullPay/fpindex.php";
// }else{
// 	// 正機
// 	var getUrl = "http://www.go365sport.com";
// 	var getRegistUrl = "http://www.go365sport.com/app/spread/registered.php";
// 	var getOpenWin = "http://www.go365sport.com/app/openWin";
// 	// var getDepositUrl = "http://www.gf1788.net/app/FullPay/fpindex.php";
// }
var getUrl = "";
	var getRegistUrl ="";
	var getOpenWin = "";
var getScoreLink = "http://bf.7m.com.cn/default_gb.aspx?classid=&view=all&match=&line=no";
var getOnlineLink = "http://f18.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=843537&configID=68479&jid=9921163027";



var userAgent = navigator.userAgent;
 
// if(/Android/i.test(userAgent)){
// 	//是否為Android
// 	location.href = getUrl;
// 	// console.log("Android");
// }else if(/iPhone/i.test(userAgent)){
// 	//是否為iPhone
// 	location.href = getUrl;
// 	// console.log("iPhone");
// }else if(/iPad/i.test(userAgent)){
// 	//是否為iPad
// 	// console.log("iPad");
// }else if(/Windows/i.test(userAgent)){
// 	//使否是用電腦觀看
// 	// console.log("Windows");
// }

// (function(m, ei, q, i, a, j, s) {
//         m[i] = m[i] || function() {
//             (m[i].a = m[i].a || []).push(arguments)
//         };
//         j = ei.createElement(q),
//         s = ei.getElementsByTagName(q)[0];
//         j.async = true;
//         j.charset = 'UTF-8';
//         j.src = '//static.meiqia.com/dist/meiqia.js?_=t';
//         s.parentNode.insertBefore(j, s);
//     })(window, document, 'script', '_MEIQIA');
// 	_MEIQIA('entId', 57591);
