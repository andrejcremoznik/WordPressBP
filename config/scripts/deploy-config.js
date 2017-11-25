module.exports = {
  defaultDeployEnv: 'staging',
  deployEnvSSH: {
    staging: {
      host: 'hostname',
      port: 22,
      username: 'user',
      agent: process.env.SSH_AUTH_SOCK
    },
    production: {
      host: 'hostname',
      port: 22,
      username: 'user',
      agent: process.env.SSH_AUTH_SOCK
    }
  },
  deployEnvPaths: {
    staging: '/srv/http/beta.WordPressBP',
    production: '/srv/http/WordPressBP'
  }
}
