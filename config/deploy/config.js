module.exports = {
  deployEnvSSH: {
    staging: {
      host: 'hostname',
      port: 22,
      username: 'user',
      agent: process.env.SSH_AUTH_SOCK,
      phpProcessGroup: 'http' // Needed to set correct folder permissions
    },
    production: {
      host: 'hostname',
      port: 22,
      username: 'user',
      agent: process.env.SSH_AUTH_SOCK,
      phpProcessGroup: 'http' // Needed to set correct folder permissions
    }
  },
  deployEnvPaths: {
    staging: '/srv/http/WordPressBP/releases',
    production: '/srv/http/WordPressBP/releases'
  }
}
