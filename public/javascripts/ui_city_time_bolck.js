const QUERY_CITY_URL = '/city';
const QUERY_DIST_URL = '/dist?city=';
const QUERY_ROAD_URL = '/road?dist=';


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

	// build time
	let _tHtml = '';
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
	_tHtml = _t.map(str => `<option value=${str}>${str}</option?`)
	$start.html(_tHtml);
	$end.html(_tHtml);

	$.ajax({
		type: 'GET',
		url: QUERY_CITY_URL,
		headers : {
			Authorization : 'Bearer ' + token
		}
	}).done(function (response) {
		let data = [{city : ''}].concat(response.data);
	  	let optHtml = (data.map(_city => `<option value=${_city.city}>${_city.city}</option>`)).join('');
		$city.html(optHtml);
	});

	$city.change(e => {
		let cityName = e.target.value;
		$.ajax({
			type: 'GET',
			url: QUERY_DIST_URL + cityName,
			headers : {
				Authorization : 'Bearer ' + token
			}
		}).done(function (response) {
			let data = [{dist : ''}].concat(response.data);
		  	let optHtml = (data.map(_dist => `<option value=${_dist.dist}>${_dist.dist}</option>`)).join('');
			$dist.html(optHtml);
		});
	});

	$dist.change(e => {
		$.ajax({
			type: 'GET',
			url: QUERY_ROAD_URL + e.target.value,
			headers : {
				Authorization : 'Bearer ' + token
			}
		}).done(function (response) {
			let data = [{road : ''}].concat(response.data);
		  	let optHtml = (data.map(_road => `<option value=${_road.road}>${_road.road}</option>`)).join('');
			$road.html(optHtml);
		});
	});

}())