const QUERY_ADD_LOT_URL = '/parking';

(function () {
	'use strict'
	var token = localStorage.getItem('easypark_token');
	if(!token) {
		alert('Please Login !!');
		window.location.href = '/login.html';
		return false;
	}
	const $city  = $('#js_city');
	const $dist  = $('#js_dist');
	const $road  = $('#js_road');
	const $Addr  = $('#js_addr');
	const $btnAdd = $('#js_btn_add');
	const $btnModify = $('#js_btn_modify');
	const $addTitile = $('#js_add_title');
	const $modifyTitle = $('#js_modify_title');
	const $start = $('#js_start');
	const $end = $('#js_end');
	const $startDate  = $('#js_start_date');
	const $endStart = $('#js_end_date');

	$addTitile.hide();
	$modifyTitle.hide();
	$btnAdd.hide();
	$btnModify.hide();


	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	let modify_parking_lot_id = urlParams.get('id');
	if(modify_parking_lot_id) {
		modify_parking_lot_id = Number(modify_parking_lot_id);
		$modifyTitle.show();
		$btnModify.show();
		$.ajax({
			type: 'GET',
			url: '/parking?parking_lot_id=' + modify_parking_lot_id,
			headers : {
				Authorization : 'Bearer ' + token
			}
		}).done(function (result) {
			let data = result.data[0];
			let mixAddr = (data.addr).split(',');
			let addr = mixAddr[1];
			let road = mixAddr[0];
			$city.val(data.city).trigger('change');
			$Addr.val(addr);

			setTimeout(() => {
				$dist.val(data.dist).trigger('change');
				setTimeout(() => {
					$road.val(road);
				}, 500);
			}, 500);

			let _start = new Date(data.start_time*1000);
			let _end = new Date(data.end_time*1000);
			let _start_m = _start.getMonth()+1;
			let _start_d = _start.getDate();
			let _start_h = _start.getHours();
			let _start_min = _start.getMinutes();
			let _end_m = _start.getMonth()+1;
			let _end_d = _start.getDate();
			let _end_h = _end.getHours();
			let _end_min = _end.getMinutes();

			if(_start_m < 10) {
				_start_m = '0' + _start_m;
			}
			if(_start_d < 10) {
				_start_d = '0' + _start_d;
			}
			if(_start_h < 10) {
				_start_h = '0' + _start_h;
			}
			if(_start_min < 10) {
				_start_min = '0' + _start_min;
			}

			if(_end_m < 10) {
				_end_m = '0' + _end_m;
			}
			if(_end_d < 10) {
				_end_d = '0' + _end_d;
			}
			if(_end_h < 10) {
				_end_h = '0' + _end_h;
			}
			if(_end_min < 10) {
				_end_min = '0' + _end_min;
			}

			$startDate.val(`${_start.getFullYear()}-${_start_m}-${_start_d}`);
			$endStart.val(`${_end.getFullYear()}-${_end_m}-${_end_d}`);

			$start.val(_start_h+':'+_start_min);
			$end.val(_end_h+':'+_end_min);
			
		});
	}else{
		$addTitile.show();
		$btnAdd.show();	
	}

	function setLot(e) {
		e.stopPropagation();

		if($(e.target).parents('form')[0].checkValidity()) {
			// e.stopPropagation();
			let getStart = new Date($startDate.val());
			let getEnd = new Date($endStart.val());
			let _start = $start.val().split(':').map(v => Number(v));
			let _end = $end.val().split(':').map(v => Number(v));
			let _city = $city.val();
			let _dist = $dist.val();
			let _addr = $road.val() + ',' +$Addr.val();
			let method = 'POST';
			let postData = {};

			getStart.setHours(_start[0], _start[1]);
			getEnd.setHours(_end[0], _end[1]);
			// alert( getStart.toUTCString() + ':' + getEnd.toUTCString() );
			_start = Math.round(getStart.getTime()/1000);
			_end = Math.round(getEnd.getTime()/1000);

			if(modify_parking_lot_id) {
				method = 'PUT';
				postData = {"parking_lot_id" : modify_parking_lot_id, "city": _city,"dist": _dist, "addr": _addr,"start_time": _start,"end_time":_end}
			}else{
				postData = {"city": _city,"dist": _dist, "addr": _addr,"start_time": _start,"end_time":_end };
			}

			$.ajax({
				type: method,
				url: QUERY_ADD_LOT_URL,
				dataType: "json",
				contentType : 'application/json;charset=utf-8',
				data : JSON.stringify(postData),
				headers : {
					Authorization : 'Bearer ' + token
				}
			}).done(function (result) {
				if(result.parking_lot_id) {
					window.location.href = '/manage_lot.html';
					
				}
			});
			e.preventDefault();
		}

	}

	$btnModify.click(setLot);


	$btnAdd.click(setLot);


}())