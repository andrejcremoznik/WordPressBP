var deployEnv = process.argv[2] || 'staging'
var deployConf = require('./config')

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error('==> Unknown deploy environment: ' + deployEnv)
  process.exit(1)
}

var version = Math.round(+new Date() / 1000)
var config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv],
  deployReleasePath: deployConf['deployEnvPaths'][deployEnv] + '/' + version
}
var NodeSSH = require('node-ssh')
var ssh = new NodeSSH()

console.log('==> Deploying to: ' + deployEnv)

ssh.connect(config.deploySSH).then(function () {
  console.log('==> Connected')

  ssh.put('build/build.tar.gz', '/tmp/build.tar.gz').then(function () {
    console.log('==> Build uploaded.')
  }, function (err) {
    console.error('==> Couldn’t upload build')
    console.log(err)
    process.exit(1)
  }).then(function () {
    console.log('==> Applying new build')

    ssh.execCommand([
      // Create new release dir
      'mkdir -p ' + config.deployReleasePath,
      // Extract uploaded tarball to new release dir
      'tar -zxf /tmp/build.tar.gz -C ' + config.deployReleasePath,
      // Symlink static files into the new release dir
      'ln -s ' + config.deployPath + '/static/uploads ' + config.deployReleasePath + '/web/app/uploads',
      'ln -s ' + config.deployPath + '/static/.env ' + config.deployReleasePath + '/.env',
      // Remove previous release dir
      'rm -rf ' + config.deployPath + '/previous',
      // Move current release to previous
      'mv ' + config.deployPath + '/current ' + config.deployPath + '/previous',
      // Move new release to current
      'mv ' + config.deployReleasePath + ' ' + config.deployPath + '/current',
      // Clean up uploaded build tarball
      'rm -f /tmp/build.tar.gz'
    ].join('&&')).then(function () {
      console.log('==> Done.')
      process.exit()
    }, function (err) {
      console.error('==> Couldn’t apply build')
      console.log(err)
      process.exit(1)
    })
  })
}, function (err) {
  console.error('==> Connection failed')
  console.log(err)
  process.exit(1)
})
