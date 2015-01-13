module.exports = {
  options: {
    stdout: true,
    stderr: true
  },
  clean: {
    command: [
    'rm -f web/app/themes/WordPressBP/assets/*.css',
    'rm -f web/app/themes/WordPressBP/assets/*.js',
    'rm -f web/app/themes/WordPressBP/assets/*.map',
    'rm -fr build'
    ].join('&&')
  },
  build: {
    command: <%= deploy_create_build %>
  }
}
