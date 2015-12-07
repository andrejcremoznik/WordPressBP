(function(App, $) {
  'use strict';

  /*
   * Init example Module1
   */
  var js = new App.Module1({
    print: 'App loaded.'
  });


  /*
   * Example event delegation helper
   *
   * 1. Capture clicks on elements with the '.js-click' class
   * 2. Pass the data-action attribute's value from clicked element to ClickHandler
   * 3. In ClickHandler check data.action's value and run custom code
   */
  $(document).on('click', '.js-click', function(e) {

    e.preventDefault();

    var
      $el = $(this),
      data = $el.data()
    ;

    if (('action' in data) && data.action)
      App.ClickHandler(data, $el);

  });

}(App, jQuery));
