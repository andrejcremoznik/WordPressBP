(function() {
	'use strict';

	var
		w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		htmlClass = 'js' // Replace .no-js with .js
	;

	// Is touch supported?
	w.isTouch = ('ontouchstart' in w);

	// Check if browser is IE and concat ie-<version> with htmlClass
	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
		var ieVerion = new Number(RegExp.$1);
		htmlClass = htmlClass + ' ie' + ieVerion;
	}
	// Add touchscreen class if touch supported, desktop otherwise
	htmlClass = htmlClass + ((isTouch) ? ' touchscreen' : ' desktop');

	// Replace class on <html> with htmlClass
	e.className = htmlClass;

	// Save viewport sizes
	w.viewportWidth  = w.innerWidth  || e.clientWidth  || g.clientWidth;
	w.viewportHeight = w.innerHeight || e.clientHeight || g.clientHeight;

}());
