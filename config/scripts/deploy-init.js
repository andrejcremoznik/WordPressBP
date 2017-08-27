const path = require('path')
const NodeSSH = require('node-ssh')
const deployEnv = process.argv[2] || 'staging'
const deployConf = require('./deploy-config')

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error('==> Unknown deploy environment: ' + deployEnv)
  process.exit(1)
}

const config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv]
}

var initProcedure = [
  // Create directories
  ['mkdir -p', path.join(config.deployPath, 'current')].join(' '),
  ['mkdir -p', path.join(config.deployPath, 'previous')].join(' '),
  ['mkdir -p', path.join(config.deployPath, 'static/uploads')].join(' '),
  // Create an empty .env config file
  ['touch', path.join(config.deployPath, 'static/.env')].join(' '),
  // Make uploads writable for PHP
  [
    'chown -R',
    [config.deploySSH.username, config.deploySSH.phpProcessGroup].join(':'),
    path.join(config.deployPath, 'static/uploads')
  ].join(' '),
  ['chmod g+w', path.join(config.deployPath, 'static/uploads')].join(' ')
].join(' && ')

var ssh = new NodeSSH()
console.log('==> Preparing directories for deploy on: ' + deployEnv)
ssh.connect(config.deploySSH)
.then(() => {
  console.log('==> Connected')
  ssh.execCommand(initProcedure)
  .then(() => {
    console.log('==> Done. Set up the ' + config.deployPath + '/static/.env file on the server. Review deploy-deploy.js script before use.')
    process.exit()
  })
  .catch((err) => {
    console.error('==> Failed')
    console.log(err)
    process.exit(1)
  })
})
.catch((err) => {
  console.error('==> Connection failed')
  console.log(err)
  process.exit(1)
})
