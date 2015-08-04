(function (App, $) {
  'use strict';

  App.ClickHandler = function (data, $el) {

    switch (data.action) {

      case 'triggerClickHandler':
        alert('Click handler triggered!');
        break;

      default:
        console.warn('Unrecognized action.');

    }

    return false;

  }

}(App, jQuery));
