
if(sessionStorage.getItem("uid")!=""){
	(function(m, ei, q, i, a, j, s) {
		m[i] = m[i] || function() {
			(m[i].a = m[i].a || []).push(arguments)
		};
		j = ei.createElement(q),
			s = ei.getElementsByTagName(q)[0];
		j.async = true;
		j.charset = 'UTF-8';
		j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
		s.parentNode.insertBefore(j, s);
	})(window, document, 'script', '_MEIQIA');
	_MEIQIA('entId', '191173');
	
	// _MEIQIA('withoutBtn');
	
	// 在这里添加自定义事件
	_MEIQIA('metadata', {
		name: sessionStorage.getItem("username"),	// 美洽默认字段
		comment : '我有问题反应', 					// 美洽默认字段
		qq : 'empty qq', 							// 自定义字段
		weibo : 'empty weibo' 						// 自定义字段
	});
	
	if(location.host=="big58-web.sog88.net" || location.host=="w1.125588.net" || location.host=="w1.125599.net" || location.host=="localhost:8080"){
		_MEIQIA('withoutBtn');
	}
	
}else if(sessionStorage.getItem("uid")==""){
	(function(m, ei, q, i, a, j, s) {
		m[i] = m[i] || function() {
			(m[i].a = m[i].a || []).push(arguments)
		};
		j = ei.createElement(q),
			s = ei.getElementsByTagName(q)[0];
		j.async = true;
		j.charset = 'UTF-8';
		j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
		s.parentNode.insertBefore(j, s);
	})(window, document, 'script', '_MEIQIA');
	_MEIQIA('entId', '191173');
	
	_MEIQIA('withoutBtn');
}

function showPanel(){
	_MEIQIA('showPanel'); 
}