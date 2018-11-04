const path = require('path')
const NodeSSH = require('node-ssh')
const deployConf = require('./deploy-config')
const deployEnv = process.argv[2] || deployConf.defaultDeployEnv

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error(`==> Unknown deploy environment: ${deployEnv}`)
  process.exit(1)
}

const config = {
  deploySSH: deployConf['deployEnvSSH'][deployEnv],
  deployPath: deployConf['deployEnvPaths'][deployEnv]
}

const initProcedure = [
  // Create directories
  `mkdir -p ${path.join(config.deployPath, 'current/web')}`,
  `mkdir -p ${path.join(config.deployPath, 'previous')}`,
  `mkdir -p ${path.join(config.deployPath, 'static/uploads')}`,
  deployEnv === 'production' ? `mkdir -p ${path.join(config.deployPath, 'static/cache')}` : false,
  // Create an empty .env config file
  `touch ${path.join(config.deployPath, 'static/.env')}`,
  // Create an index.php inside webroot
  `echo -e "<?php phpinfo();\n" > ${path.join(config.deployPath, 'current/web/index.php')}`
].filter(cmd => cmd).join(' && ')

const ssh = new NodeSSH()
console.log(`==> Preparing directories for deploy on: ${deployEnv}`)
ssh.connect(config.deploySSH)
.then(() => {
  console.log(`==> Connected.`)
  return ssh.execCommand(initProcedure)
})
.then(() => {
  console.log(`==> Done. You still need to:`)
  console.log(`- Set up the web server with webroot in "${config.deployPath}/current/web".`)
  console.log(`- Configure ${config.deployPath}/static/.env.`)
  console.log(`- Make ${config.deployPath}/static/uploads writable for the PHP process group.`)
  if (deployEnv === 'production') {
    console.log(`- Make ${config.deployPath}/static/cache writable for the PHP process group and your SSH user.`)
  }
  ssh.dispose()
})
.catch(err => {
  console.error(`==> Failed.`)
  console.log(err)
  process.exitCode = 1
  ssh.dispose()
})
