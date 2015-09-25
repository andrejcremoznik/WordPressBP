module.exports = {
  options: {
    preserveComments: false,
    screwIE8: true
  },
  build: {
    expand:  true,
    flatten: true,
    src:     'web/app/themes/WordPressBP/assets/*.js',
    dest:    'web/app/themes/WordPressBP/assets/'
  }
}
