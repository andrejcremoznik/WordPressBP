(function(App, $) {
  'use strict';

  if (!('Module1' in App))
    App.Module1 = {};

  function Module1(options) {

    this.options = $.extend({}, Module1.DEFAULTS, options);

    this.init();
  }

  Module1.DEFAULTS = {
    print: 'Module1 loaded.'
  }

  Module1.prototype = {

    init: function() {
      console.log(this.options.print);
    }

  }

  App.Module1 = Module1;

}(App, jQuery));
