module.exports = function(grunt) {
  'use strict';

  // Set up basic configuration
  var
    path = require('path'),
    config = {},

    // Use a Unix timestamp for asset cache busting and deploy directory name
    version = Math.round(+new Date()/1000),
    // Save long path to assets in a variable
    assets = 'web/app/themes/WordPressBP/assets',

    /*
     * Get deploy environment from args passed to grunt on CLI
     *
     *  E.g. "grunt deploy --env=production"
     *
     * Defaults to --env=staging
     */
    deploy_env = grunt.option('env') || 'staging',

    /*
     * SSH connection details for different environments
     *
     * This requires the use of an SSH agent. You should have your keys unlocked
     * before starting to deploy.
     *
     * Keychain howto: https://wiki.archlinux.org/index.php/SSH_keys#Keychain
     */
    deploy_env_ssh = {
      staging: {
        host:     'hostname',
        port:     22,
        username: 'user'
      }
    },

    /*
     * Set up deploy directories for different environments (without trailing /)
     */
    deploy_env_paths = {
      staging: '/var/www/WordPressBP/releases'
    }
  ;

  // Validate deploy environment
  if(!(deploy_env in deploy_env_ssh))
    grunt.fail.fatal('Unknown deploy environment!');

  // Save configuration params to pass along to grunt tasks for deployment
  config.deploy_ssh          = deploy_env_ssh[deploy_env];
  config.deploy_path         = deploy_env_paths[deploy_env];
  config.deploy_release_path = deploy_env_paths[deploy_env] + '/' + version;

  /*
    * Create build tarball to upload to server.
    *
    * Basically we create a "build" directory and copy everything into that folder
    * including 3rd party dependencies like composer libs, bower assets and locally
    * built assets (JS, CSS...).
    *
    * In the end we compress everything into a single tar archive (tarball).
    *
    * Below is an example for a wordpress theme with bedrock-like structure.
    * Bedrock: https://github.com/roots/bedrock
    */
  config.deploy_create_build = [
    // Create build dir
    'mkdir build',
    // Export repository contents to build dir
    'git archive --format=tar --prefix=build/ HEAD | (tar xf -)',
    // Copy generated static assets into the build dir
    'cp ' + assets + '/*.js build/' + assets + '/',
    'cp ' + assets + '/*.css build/' + assets + '/',
    // Prepend license headers to JS and CSS files
    'cat web/licenses/js-bottom-licenses.js build/' + assets + '/bottom.js > bottom.js && mv -f bottom.js build/' + assets + '/',
    'cat web/licenses/css-licenses.css build/' + assets + '/theme_default.css > theme_default.css && mv -f theme_default.css build/' + assets + '/',
    // Replace version string (vDEV) in functions.php for cache busting
    'sed -i "s/vDEV/' + version + '/g" build/web/app/themes/WordPressBP/functions.php',
    // Uploads dir is not needed in build (will be symlinked into place on deploy)
    'rm -fr build/web/app/uploads',
    // Move into build dir, fetch composer dependencies and create tarball
    'cd build',
    'composer install',
    // Create tarball
    'tar -zcf build.tar.gz *'
  ].join('&&');

  /*
    * Unpack tarball on deploy environment and apply it.
    *
    * Once the tarball is uploaded to deploy environment we create the deploy
    * directory inside "deploy_path" with the name in the "version" variable.
    *
    * The contents of the tarball are then exported to that directory. Static assets
    * get symlinked into place.
    *
    * If there's a "previous" directory from a previous deploy, it will be removed.
    *
    * "current" directory is renamed to "previous" and new deploy directory is
    * renamed to "current".
    *
    * "current" is the directory the webserver uses as web root e.g.
    * /var/www/mywebsite/releases/current/web
    */
  config.deploy_apply_build = [
    // Create new release dir
    'mkdir -p ' + config.deploy_release_path,
    // Extract uploaded tarball to new release dir
    'tar -zxf /tmp/build.tar.gz -C ' + config.deploy_release_path,
    // Symlink static files into the new release dir
    'ln -s ' + config.deploy_path + '/static/uploads ' + config.deploy_release_path + '/web/app/uploads',
    'ln -s ' + config.deploy_path + '/static/.env ' + config.deploy_release_path + '/.env',
    // Remove previous release dir
    'rm -rf ' + config.deploy_path + '/previous',
    // Move current release to previous
    'mv ' + config.deploy_path + '/current ' + config.deploy_path + '/previous',
    // Move new release to current
    'mv ' + config.deploy_release_path + ' ' + config.deploy_path + '/current',
    // Clean up uploaded build tarball
    'rm -f /tmp/build.tar.gz'
  ].join('&&');

  /*
    * If something's wrong, simply revert to previous deployment.
    *
    * Rename the "current" directory to "broken" and "previous" to "current".
    * After that remove the "broken" directory.
    */
  config.deploy_revert = [
    // Rename symlink to current (broken) release
    'mv ' + config.deploy_path + '/current ' + config.deploy_path + '/broken',
    // Restore symlink to previous (working) release
    'mv ' + config.deploy_path + '/previous ' + config.deploy_path + '/current',
    // Remove broken release dir and symlink
    'rm -rf ' + config.deploy_path + '/broken'
  ].join('&&');


  // Finally load in Grunt
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'config/grunt'),
    data: config
  });

}
