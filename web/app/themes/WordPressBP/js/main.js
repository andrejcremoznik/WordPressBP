var $ = window.jQuery

/**
 * Example event delegation helper
 *
 * 1. Capture clicks on elements with the '.js-click' class
 * 2. Pass the data-action attribute's value from clicked element to clickHandler
 * 3. In clickHandler check data.action's value and run custom code
 */
var clickHandler = require('./app/click-handler')
$(document).on('click', '.js-click', function (e) {
  e.preventDefault()

  var $el = $(this)
  var data = $el.data()

  if (('action' in data) && data.action) {
    data.action.split(',').forEach(function (act) {
      clickHandler(act, data, $el)
    })
  }
})

// Example module
var Module1 = require('./app/module1')
Module1.init({ msg: 'App loaded.' })
