const path = require('path')
const NodeSSH = require('node-ssh')
const version = Math.round(+new Date() / 1000).toString()
const deployConf = require('../deploy-config')
const deployEnv = process.argv[2] || deployConf.defaultDeployEnv

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error(`==> Unknown deploy environment: ${deployEnv}`)
  process.exit(1)
}

const config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv],
  deployReleasePath: path.join(deployConf['deployEnvPaths'][deployEnv], version),
  deployTmp: '/tmp/build.tar.gz',
  wpCliPath: path.join(deployConf['deployEnvPaths'][deployEnv], 'current/web/wp')
}

// Build bash shell command to exeute on the server
const deployProcedure = [
  // Create new release dir
  `mkdir -p ${config.deployReleasePath}`,
  // Extract uploaded tarball to new release dir
  `tar -zxf ${config.deployTmp} -C ${config.deployReleasePath}`,
  // Symlink static files into the new release dir
  [
    'ln -s',
    path.join(config.deployPath, 'static/uploads'),
    path.join(config.deployReleasePath, 'web/app/uploads')
  ].join(' '),
  deployEnv === 'production' ? [
    'ln -s',
    path.join(config.deployPath, 'static/cache'),
    path.join(config.deployReleasePath, 'cache')
  ].join(' ') : false,
  [
    'ln -s',
    path.join(config.deployPath, 'static/.env'),
    path.join(config.deployReleasePath, '.env')
  ].join(' '),
  // NOTE: Set up a symlink to a common `.well-known` webroot for Certbot
  // [
  //   'ln -s',
  //   '/srv/http/certs/.well-known',
  //   path.join(config.deployReleasePath, 'web/.well-known')
  // ].join(' '),
  // NOTE: Enable object cache on production
  // deployEnv === 'production' ? [
  //   'cp',
  //   path.join(config.deployReleasePath, 'web/app/plugins/redis-cache/includes/object-cache.php'),
  //   path.join(config.deployReleasePath, 'web/app/object-cache.php')
  // ].join(' ') : false,
  // Remove previous release dir
  `rm -fr ${path.join(config.deployPath, 'previous')}`,
  // Move current release to previous
  `mv ${path.join(config.deployPath, 'current')} ${path.join(config.deployPath, 'previous')}`,
  // Move new release to current
  `mv ${config.deployReleasePath} ${path.join(config.deployPath, 'current')}`,
  // NOTE: Clear cache on production
  // deployEnv === 'production' ? `wp timber clear_cache --path=${config.wpCliPath}` : false,
  // deployEnv === 'production' ? `wp transient delete --all --path=${config.wpCliPath}` : false,
  // deployEnv === 'production' ? `wp cache flush --path=${config.wpCliPath}` : false,
  // Remove uploaded build tarball
  `rm -f ${config.deployTmp}`
].filter(cmd => cmd).join(' && ')

// Run
const ssh = new NodeSSH()
console.log(`==> Deploying to: ${deployEnv}`)
ssh.connect(config.deploySSH)
  .then(() => {
    console.log(`==> Connected. Uploading…`)
    return ssh.putFile('build/build.tar.gz', config.deployTmp, null, { concurrency: 1 })
  })
  .then(() => {
    console.log(`==> Applying new build…`)
    return ssh.execCommand(deployProcedure)
  })
  .then(() => {
    console.log(`==> Done.`)
  })
  .catch(err => {
    console.error(`==> Failed.`)
    console.log(err)
    process.exitCode = 1
  })
  .finally(() => {
    ssh.dispose()
  })
