const LOGIN_URL = '/user/login';

(function () {
	'use strict'

	let $btnLogin = $('#btn_login');
	let $username = $('#inputUsername');
	let $password = $('#inputPassword');
	let $msgErr = $('#msg_err');

	$btnLogin.click(e => {
		e.stopPropagation();

		if($username.val() != '' && $password.val() != '') {
			$.post(LOGIN_URL, {
				"username": $username.val(),//"anita_test",
				"password" : $password.val()//"qwertyui"
			}, function( data ) {
				if(!!data.user_id) {
					localStorage.setItem('easypark_token', data.token);
					window.location.href = '/index.html';
					// window.location.href = window.location.hostname + '/index.html';
					// var t = localStorage.getItem('easypark_token');
					// localStorage.removeItem('myCat');
					// localStorage.clear();

				}else{
					$msgErr.html(data.message);
				}
			});
		}

	});

}())