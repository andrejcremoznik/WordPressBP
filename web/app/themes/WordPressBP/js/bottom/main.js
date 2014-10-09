(function(App, $) {
  'use strict';

  $(function() {
    // Call test module
    var js = new App.Module1({
      print: 'App loaded.'
    });
  });

}(App, jQuery));
