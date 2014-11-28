(function(w, d, className) {
  'use strict';

  var
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0]
  ;

  // Is touch supported?
  w.isTouch = ('ontouchstart' in w);

  // Check if browser is IE and concat ie-<version> with className
  if(/MSIE (\d+\.\d+);/.test(navigator.userAgent) || (Object.hasOwnProperty.call(w, 'ActiveXObject') && !w.ActiveXObject)) {
    var ieVersion = new Number(RegExp.$1) <= 10 ? new Number(RegExp.$1) : Object.hasOwnProperty.call(w, 'ActiveXObject') && !w.ActiveXObject ? '11' : '';
    className = className + ' ie' + ieVersion;
  }
  // Add touchscreen class if touch supported, desktop otherwise
  className = className + ((isTouch) ? ' touchscreen' : ' desktop');

  // Replace class on <html> with className
  e.className = className;

  // Save viewport sizes
  w.viewportWidth  = w.innerWidth  || e.clientWidth  || g.clientWidth;
  w.viewportHeight = w.innerHeight || e.clientHeight || g.clientHeight;

}(window, document, 'js'));
