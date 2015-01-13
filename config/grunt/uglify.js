module.exports = {
  options: {
    preserveComments: false
  },
  build: {
    expand:  true,
    flatten: true,
    src:     'web/app/themes/WordPressBP/assets/*.js',
    dest:    'web/app/themes/WordPressBP/assets/'
  }
}
