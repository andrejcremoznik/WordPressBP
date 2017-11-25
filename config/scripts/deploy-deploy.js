const path = require('path')
const NodeSSH = require('node-ssh')
const version = Math.round(+new Date() / 1000).toString()
const deployConf = require('./deploy-config')
const deployEnv = process.argv[2] || deployConf.defaultDeployEnv

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error(`==> Unknown deploy environment: ${deployEnv}`)
  process.exit(1)
}

const config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv],
  deployReleasePath: path.join(deployConf['deployEnvPaths'][deployEnv], version),
  deployTmp: '/tmp/build.tar.gz'
}

// Build bash shell command to exeute on the server
let deployProcedure = [
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
    path.join(config.deployPath, 'static/.env'),
    path.join(config.deployReleasePath, '.env')
  ].join(' '),

  // NOTE: If you use Let's Encrypt, you might want to set up a symlink to "certs/.well-known" directory
  // [
  //   'ln -s',
  //   '/srv/http/certs/.well-known',
  //   path.join(config.deployReleasePath, 'web/.well-known')
  // ].join(' '),

  // NOTE: If you want to enable object cache on production, copy object-cache.php from the caching plugin to /web/app/
  // deployEnv === 'production' ? [
  //   'cp',
  //   path.join(config.deployReleasePath, 'web/app/plugins/redis-cache/includes/object-cache.php'),
  //   path.join(config.deployReleasePath, 'web/app/object-cache.php')
  // ].join(' ') : false, // "false" will drop the item from command chain when condition doesn't match

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
    config.deployReleasePath,
    path.join(config.deployPath, 'current')
  ].join(' '),
  // Remove uploaded build tarball
  ['rm -f', config.deployTmp].join(' ')
].filter(cmd => cmd).join(' && ')

// Run
let ssh = new NodeSSH()
console.log(`==> Deploying to: ${deployEnv}`)
ssh.connect(config.deploySSH)
.then(() => {
  console.log(`==> Connected. Uploading…`)
  ssh.putFile('build/build.tar.gz', config.deployTmp)
  .then(() => {
    console.log(`==> Applying new build…`)
    ssh.execCommand(deployProcedure)
    .then(() => {
      console.log(`==> Done.`)
      process.exit()
    })
    .catch(err => {
      console.error(`==> Couldn’t apply build.`)
      throw err
    })
  })
  .catch(err => {
    console.error(`==> Upload failed.`)
    throw err
  })
})
.catch(err => {
  console.error(`==> Connection failed.`)
  throw err
})
