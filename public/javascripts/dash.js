const QUERY_MY_RENT_URL = '/my/renting';
const QUERY_SEARCH_URL = '/search/parking';

(function () {
	'use strict'
	var token = localStorage.getItem('easypark_token');
	if(!token) {
		alert('Please Login !!');
		window.location.href = '/login.html';
		return false;
	}
	const $mainBody  = $('#js_main_body');
	const $city  = $('#js_city');
	const $dist  = $('#js_dist');
	const $road  = $('#js_road');
	const $btnSearch = $('#js_btn_search');
	const $start = $('#js_start');
	const $end = $('#js_end');
	const $displayMyRent  = $('#js_display_my_rent');
	const $displaySearchRow = $('#js_display_search_row');

	$displayMyRent.parent('table').hide();
	$displaySearchRow.parent('table').hide();


	$.ajax({
		type: 'GET',
		url: QUERY_MY_RENT_URL,
		headers : {
			Authorization : 'Bearer ' + token
		}
	}).done(function (result) {
		let tdArr = [];

		result.data.forEach((row, i) => {
			tdArr.push(`<tr>`);
			tdArr.push(`<td>${i + 1}</td>`);
			tdArr.push(`<td>${row.city + row.dist + row.addr }</td>`);
			tdArr.push(`<td>${moment.unix(row.start_time).format('MM/DD/YYYY h:mm:ss a')}</td>`);
			tdArr.push(`<td>${moment.unix(row.end_time).format('MM/DD/YYYY h:mm:ss a')}</td>`);
			tdArr.push(`<td>${row.lessor}</td>`);
			tdArr.push(`<td>${row.lessor_mobile}</td>`);
			tdArr.push(`<td><button class="js_btn_stop" data-id="${row.parking_lot_id}">停止</button></td>`);
			tdArr.push(`</tr>`);
		});

		$displayMyRent.parent('table').show().end().html(tdArr.join(''));
		$('.js_btn_stop').click(e => {
			let lot_id = $(e.target).data('id');
			var yes = confirm('你確定嗎？');

			if (yes) {
				$.ajax({
					type: 'POST',
					url: 'my/renting/stop',
					dataType: "json",
					contentType : 'application/json;charset=utf-8',
					data : JSON.stringify({parking_lot_id : Number(lot_id)}),
					headers : {
						Authorization : 'Bearer ' + token
					}
				}).done(function (result) {
					if(result.message == 'Success') {
						location.reload();
					}
				});
			}
		});

	});

	$btnSearch.click(e => {
		let getStart = new Date();
		let getEnd = new Date();
		let _start = $start.val().split(':').map(v => Number(v));
		let _end = $end.val().split(':').map(v => Number(v));
		let _city = $city.val();
		let _dist = $dist.val();
		let param = '';

		getStart.setHours(_start[0], _start[1]);
		getEnd.setHours(_end[0], _end[1]);
		// alert( getStart.getTime() + ':' + getEnd.getTime() );
		_start = Math.round(getStart.getTime()/1000);
		_end = Math.round(getEnd.getTime()/1000);

		param = `?city=${_city}&dist=${_dist}&start_time=${_start}&end_time=${_end}`;

		$.ajax({
			type: 'GET',
			url: QUERY_SEARCH_URL + param,
			headers : {
				Authorization : 'Bearer ' + token
			}
		}).done(function (result) {
			let tdArr = [];

			result.data.forEach((row, i) => {
				tdArr.push(`<tr>`);
				tdArr.push(`<td>${i + 1}</td>`);
				tdArr.push(`<td>${row.city + row.dist + row.addr }</td>`);
				tdArr.push(`<td>${moment.unix(row.start_time).format('MM/DD/YYYY h:mm:ss a')}</td>`);
				tdArr.push(`<td>${moment.unix(row.end_time).format('MM/DD/YYYY h:mm:ss a')}</td>`);
				tdArr.push(`<td>${row.lessor}</td>`);
				tdArr.push(`<td>${row.lessor_mobile}</td>`);
				tdArr.push(`<td><button class="js_rent_btn" data-lot-id="${row.parking_lot_id}">租借</button>`);
				tdArr.push(`</tr>`);

			});

			$displaySearchRow.parent('table').show().end().html(tdArr.join(''));
			
			$('.js_rent_btn').click(e => {
				let parking_lot_id = Number($(e.target).data('lot-id'));
				$.ajax({
					type: 'POST',
					url: '/renting/parking/',
					dataType: "json",
					contentType : 'application/json;charset=utf-8',
					data : JSON.stringify({"parking_lot_id": parking_lot_id}),
					headers : {
						Authorization : 'Bearer ' + token
					}
				}).done(function (result) {
					if(result.message == 'Success') {
						location.reload();
					}
				});
			});
			
		});

	});


}())