var $ = window.jQuery

module.exports = {
  init: function (opts) {
    var options = $.extend({}, {
      msg: 'Module1 loaded.'
    }, opts)
    console.log(options.msg)
  }
}
