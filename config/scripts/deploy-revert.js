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

// Build bash shell command to exeute on the server
var revertProcedure = [
  // Rename folder for current release to broken
  [
    'mv',
    path.join(config.deployPath, 'current'),
    path.join(config.deployPath, 'broken')
  ].join(' '),
  // Rename folder for previous (working) release to current
  [
    'mv',
    path.join(config.deployPath, 'previous'),
    path.join(config.deployPath, 'current')
  ].join(' '),
  // Remove broken release dir
  ['rm -fr', path.join(config.deployPath, 'broken')].join(' ')
].join(' && ')

// Run
var ssh = new NodeSSH()
console.log('==> Reverting to previous deploy on: ' + deployEnv)
ssh.connect(config.deploySSH)
.then(() => {
  console.log('==> Connected')
  ssh.execCommand(revertProcedure)
  .then(() => {
    console.log('==> Done')
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
