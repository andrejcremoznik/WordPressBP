define(['jquery'], function($) {

	function Module1(options) {

		this.options = $.extend({}, Module1.DEFAULTS, options);

		this.init();
	}

	Module1.DEFAULTS = {

	}

	Module1.prototype = {

		init: function() {
			console.log('module1.js loaded');
		}

	}

	return Module1;

});
