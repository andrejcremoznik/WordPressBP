const path = require('path')
const NodeSSH = require('node-ssh')
const version = Math.round(+new Date() / 1000)
const deployEnv = process.argv[2] || 'staging'
const deployConf = require('./config')

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error('==> Unknown deploy environment: ' + deployEnv)
  process.exit(1)
}

const config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv],
  deployReleasePath: path.join(deployConf['deployEnvPaths'][deployEnv], version),
  deployTmp: '/tmp/build.tar.gz'
}

// Build bash shell command to exeute on the server
var deployProcedure = [
  // Create new release dir
  ['mkdir -p', config.deployReleasePath].join(' '),
  // Extract uploaded tarball to new release dir
  ['tar -zxf', config.deployTmp, '-C', config.deployReleasePath].join(' '),
  // Symlink static files into the new release dir
  [
    'ln -s',
    path.join(config.deployPath, 'static/uploads'),
    path.join(config.deployReleasePath, 'web/app/uploads')
  ].join(' '),
  [
    'ln -s',
    path.join(config.deployPath, 'static/env'),
    path.join(config.deployReleasePath, '.env')
  ].join(' '),
  // Remove previous release dir
  ['rm -fr', path.join(config.deployPath, 'previous')].join(' '),
  // Move current release to previous
  [
    'mv',
    path.join(config.deployPath, 'current'),
    path.join(config.deployPath, 'previous')
  ].join(' '),
  // Move new release to current
  [
    'mv',
    config.deployReleasePath
    path.join(config.deployPath, 'current')
  ].join(' '),
  // Remove uploaded build tarball
  ['rm -f', config.deployTmp].join(' ')
].join(' && ')

// Run
var ssh = new NodeSSH()
console.log('==> Deploying to: ' + deployEnv)
ssh.connect(config.deploySSH)
.then(() => {
  console.log('==> Connected')
  ssh.putFile('build/build.tar.gz', config.deployTmp)
  .then(() => {
    console.log('==> Applying new build')
    ssh.execCommand(deployProcedure)
    .then((result) => {
      console.log('==> Done.')
      console.log(['STDOUT:', result.stdout].join(' '))
      console.log(['STDERR:', result.stderr].join(' '))
      process.exit()
    })
    .catch((err) => {
      console.error('==> Couldn’t apply build')
      console.log(err)
      process.exit(1)
    })
  })
  .catch((err) => {
    console.error('==> Upload failed')
    console.log(err)
    process.exit(1)
  })
})
.catch((err) => {
  console.error('==> Connection failed')
  console.log(err)
  process.exit(1)
})
