"use strict";

var app = (function () {
	return {
		init: function () {
			app.setUpListeners();
		},
		setUpListeners: function () {
			$('.slider__list').bxSlider({
				useCSS: false,
				controls: false,
				pager: true
			});
			$('.pager-link').text('');
		}
	}
})();

app.init();