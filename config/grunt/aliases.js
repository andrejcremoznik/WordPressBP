module.exports = {
  'default': [
    'concat',
    'sass',
    'autoprefixer'
  ],
  'production': [
    'concat',
    'uglify',
    'sass',
    'autoprefixer',
    'csso'
  ],
  'clean': [
    'shell:'
  ],
  'deploy': [
    'shell:clean',
    'concat',
    'uglify',
    'sass',
    'autoprefixer',
    'csso',
    'shell:build',
    'sftp:upload',
    'sshexec:deploy'
  ],
  'deploy-revert': [
    'sshexec:revert'
  ]
}
