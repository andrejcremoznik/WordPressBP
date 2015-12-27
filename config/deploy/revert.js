var deployEnv = process.argv[2] || 'staging'
var deployConf = require('./config')

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error('==> Unknown deploy environment: ' + deployEnv)
  process.exit(1)
}

var config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv]
}
var NodeSSH = require('node-ssh')
var ssh = new NodeSSH()

ssh.connect(config.deploySSH).then(function () {
  console.log('==> Connected')
  ssh.execCommand([
    // Rename symlink to current (broken) release
    'mv ' + config.deployPath + '/current ' + config.deployPath + '/broken',
    // Restore symlink to previous (working) release
    'mv ' + config.deployPath + '/previous ' + config.deployPath + '/current',
    // Remove broken release dir and symlink
    'rm -rf ' + config.deployPath + '/broken'
  ].join('&&')).then(function () {
    console.log('==> Done')
    process.exit()
  }, function (err) {
    console.error('==> Failed')
    console.log(err)
    process.exit(1)
  })
}, function (err) {
  console.error('==> Connection failed')
  console.log(err)
  process.exit(1)
})
