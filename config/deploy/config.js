module.exports = {
  deployEnvSSH: {
    staging: {
      host: 'hostname',
      port: 22,
      username: 'user'
    },
    production: {
      host: 'hostname',
      port: 22,
      username: 'user'
    }
  },
  deployEnvPaths: {
    staging: '/srv/http/WordPressBP/releases',
    production: '/srv/http/WordPressBP/releases'
  }
}
