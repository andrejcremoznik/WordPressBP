module.exports = {
  stylesheets: {
    files: ['web/app/themes/WordPressBP/css/**/*.scss'],
    tasks: ['sass', 'autoprefixer']
  },
  scripts: {
    files: ['web/app/themes/WordPressBP/js/**/*.js'],
    tasks: ['concat']
  }
}
