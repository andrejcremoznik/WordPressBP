module.exports = {
  options: {
    stripBanners: true,
    separator: '\n;' // Make sure single line comments don't screw up concatenation
  },
  top: {
    files: {
      'web/app/themes/WordPressBP/assets/top.js': [
        'web/app/themes/WordPressBP/js/top/*.js'
      ]
    }
  },
  bottom: {
    options: {
      banner: 'var App = App || {};' // Add App namespace at start of our JS app build
    },
    files: {
      'web/app/themes/WordPressBP/assets/bottom.js': [
        'bower_modules/jquery/dist/jquery.min.js', // bower dependency
        'web/app/themes/WordPressBP/js/bottom/module1.js',
        'web/app/themes/WordPressBP/js/bottom/main.js'
      ]
    }
  }
}
