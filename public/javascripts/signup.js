const CREATE_USER_URL = '/user/create';

(function () {
	'use strict'

	let $btnLogin = $('#btn_login');
	let $username = $('#inputUsername');
	let $password = $('#inputPassword');
	let $mobile = $('#inputMobile');
	let $msgErr = $('#msg_err');

	$btnLogin.click(e => {
		e.stopPropagation();
		// $('.alert').alert();

		if($username.val() != '' && $password.val() != '' && $mobile.val() != '') {
			$.post(CREATE_USER_URL, {
				"username": $username.val(),
				"password" : $password.val(),
				"mobile" : $mobile.val()
			}, function( data ) {				
				if(!!data.user_id) {
					$.blockUI({ message: '<div class="p-2"><div class="spinner-border text-secondary" role="status"></div><h3 class="ml-2 d-inline-block">Sign in Successfully</h3></div>' });

					setTimeout(()=>{
						window.location.href = '/login.html';
					}, 1500);
				}else{
					$msgErr.html(data.message + ' ' + data.error);
				}
			}).fail(function(xhr, status, error) {
				let data = xhr.responseJSON;
				console.log(xhr.responseJSON, error)
				$msgErr.html(data.message + '. ' + data.error);
			});
		}

	});

}())