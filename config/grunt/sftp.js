module.exports = {
  options: {
    host:        '<%= deploy_ssh.host %>',
    port:        '<%= deploy_ssh.port %>',
    username:    '<%= deploy_ssh.username %>',
    agent:       process.env.SSH_AUTH_SOCK,
    path:        '/tmp/',
    srcBasePath: 'build/',
    showProgress: true
  },
  upload: {
    files: { './': ['build/build.tar.gz'] }
  }
}
