module.exports = {
  options: {
    browsers: ['last 2 versions']
  },
  build: {
    expand:  true,
    flatten: true,
    src:     'web/app/themes/WordPressBP/assets/*.css',
    dest:    'web/app/themes/WordPressBP/assets/'
  }
}
