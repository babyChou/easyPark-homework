let helper = {};
(function () {
	'use strict'
	// build time
	let _t = [];
	for (var i = 0; i < 24; i++) {
		if(i < 10) {
			_t.push('0' + i + ':00');
			_t.push('0' + i + ':30');
		}else{
			_t.push(i + ':00');
			_t.push(i + ':30');
		}
	}
	helper.timeArr = _t;

}())