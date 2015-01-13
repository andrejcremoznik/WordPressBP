module.exports = {
  options: {
    imagePath: '/app/themes/WordPressBP/assets',
    precision: 5
  },
  build: {
    options: {
      sourceMap:   true,
      outputStyle: 'nested'
    },
    expand:  true,
    flatten: true,
    src:  'web/app/themes/WordPressBP/css/*.scss',
    dest: 'web/app/themes/WordPressBP/assets/',
    ext:  '.css'
  }
}
