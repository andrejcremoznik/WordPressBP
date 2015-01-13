module.exports = {
  options: {
    host:     '<%= deploy_ssh.host %>',
    port:     '<%= deploy_ssh.port %>',
    username: '<%= deploy_ssh.username %>',
    agent:    process.env.SSH_AUTH_SOCK
  },
  deploy: {
    command:  '<%= deploy_apply_build %>'
  },
  revert: {
    command:  '<%= deploy_revert %>'
  }
}
