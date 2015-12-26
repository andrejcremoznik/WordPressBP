var
  deployEnv = process.argv[2] || 'staging',
  deployConf = require('./config')
;

if (!(deployEnv in deployConf.deployEnvSSH)) {
  console.error('Unknown deploy environment: ' + deployEnv);
  process.exit(1);
}

var
  config   = {
    deploySSH:  deployConf['deployEnvSSH'][deployEnv],
    deployPath: deployConf['deployEnvPaths'][deployEnv]
  },
  node_ssh = require('node-ssh'),
  ssh      = new node_ssh()
;

ssh.connect(config.deploySSH).then(function() {

  console.log('Connected');

  ssh.execCommand([
    // Rename symlink to current (broken) release
    'mv ' + config.deployPath + '/current ' + config.deployPath + '/broken',
    // Restore symlink to previous (working) release
    'mv ' + config.deployPath + '/previous ' + config.deployPath + '/current',
    // Remove broken release dir and symlink
    'rm -rf ' + config.deployPath + '/broken'
  ].join('&&')).then(function(result) {
    console.log('STDOUT: ' + result.stdout);
    console.log('STDERR: ' + result.stderr);
    console.log('Done.');
  });

});
