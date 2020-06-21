(function () {
	'use strict'
	let $sidebarMenu = $('#sidebarMenu');
	const pathname = window.location.pathname;

	$sidebarMenu.load( "./sidebar.html", function() {
		$sidebarMenu
			.find('a')
				.removeClass('active')
					.filter(function(){
						return pathname.match($(this).attr('href'));
					}).addClass('active');

	});

}())