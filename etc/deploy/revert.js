const path = require('path')
const NodeSSH = require('node-ssh')
const deployConf = require('../deploy-config')
const deployEnv = process.argv[2] || deployConf.defaultDeployEnv

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error(`==> Unknown deploy environment: ${deployEnv}`)
  process.exit(1)
}

const config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv],
  wpCliPath: path.join(deployConf['deployEnvPaths'][deployEnv], 'current/web/wp')
}

// Build bash shell command to exeute on the server
const revertProcedure = [
  // Rename folder for current release to broken
  `mv ${path.join(config.deployPath, 'current')} ${path.join(config.deployPath, 'broken')}`,
  // Rename folder for previous (working) release to current
  `mv ${path.join(config.deployPath, 'previous')} ${path.join(config.deployPath, 'current')}`,
  // NOTE: Clear cache on production
  // deployEnv === 'production' ? `wp timber clear_cache --path=${config.wpCliPath}` : false,
  // deployEnv === 'production' ? `wp transient delete --all --path=${config.wpCliPath}` : false,
  // deployEnv === 'production' ? `wp cache flush --path=${config.wpCliPath}` : false,
  // Remove broken release dir
  `rm -fr ${path.join(config.deployPath, 'broken')}`,
  // Add empty previous dir to avoid a warning on next deploy
  `mkdir ${path.join(config.deployPath, 'previous')}`
].filter(cmd => cmd).join(' && ')

// Run
const ssh = new NodeSSH()
console.log(`==> Reverting to previous deploy on: ${deployEnv}`)
ssh.connect(config.deploySSH)
  .then(() => {
    console.log(`==> Connected.`)
    return ssh.execCommand(revertProcedure)
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
