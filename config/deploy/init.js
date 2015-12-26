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
    // Create directories
    'mkdir -p ' + config.deployPath + '/{current,previous,static}',
    'mkdir ' + config.deployPath + '/static/uploads',
    // Create an empty .env config file
    'touch ' + config.deployPath + '/static/.env',
    // Make uploads writable for PHP (in my case PHP process is the `http` group)
    'chown -R ' + config.deploySSH.username + ':http ' + config.deployPath + '/static/uploads',
    'chmod g+w ' + config.deployPath + '/static/uploads'
  ].join('&&')).then(function(result) {
    console.log('STDOUT: ' + result.stdout);
    console.log('STDERR: ' + result.stderr);
    console.log('Done. Please set up the .env file and anything else you need to copy to the server. Review deploy.js script and deploy with `npm run deploy`.');
  });

});
