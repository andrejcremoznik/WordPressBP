module.exports = function(grunt) {
  'use strict';

  /*
   * Use Grunt for deployment
   */
  var
    // Use a unix timestamp (unique string) for asset cache busting and deploy directory name
    version = Math.round(+new Date()/1000),

    /*
     * Get deploy branch and environment from args passed to grunt on CLI
     *
     *  E.g. "grunt deploy --env=production --branch=devel"
     *
     * Defaults to --env=staging --branch=master
     */
    deploy_env    = grunt.option('env')    || 'development',
    deploy_branch = grunt.option('branch') || 'master',

    /*
     * SSH connection details for different environments
     *
     * This requires the use of an SSH agent. You should have your keys unlocked
     * before starting to deploy.
     *
     * Keychain howto: https://wiki.archlinux.org/index.php/SSH_keys#Keychain
     */
    deploy_env_ssh = {
      'development': {
        host: 'hostname',
        port: 22,
        username: 'user',
        agent: process.env.SSH_AUTH_SOCK
      }
    },

    /*
     * Set up deploy directories for different environments (without trailing /)
     */
    deploy_env_paths = {
      development: '/var/www/WordPressBP/releases'
    },

    deploy_path = deploy_env_paths[deploy_env],
    deploy_release_path = deploy_env_paths[deploy_env] + '/' + version,

    /*
     * Create build tarball to upload to server.
     *
     * Basically we create a "build" directory and copy everything into that folder
     * including 3rd party dependencies like composer libs, bower assets and of
     * course locally build assets (JS, CSS...).
     *
     * In the end we compress everything into a single tar archive (tarball).
     *
     * Below is an example for a wordpress theme with bedrock-like structure.
     * Bedrock: https://github.com/roots/bedrock
     */
    deploy_create_build = [
      // Create build dir
      'mkdir build',
      // Export repository contents to build dir
      'git archive --format=tar ' + deploy_branch + ' | tar -x -C build',
      // Copy generated static assets into the build dir
      'cp web/app/themes/WordPressBP/assets/*.js build/web/app/themes/WordPressBP/assets/',
      'cp web/app/themes/WordPressBP/assets/*.css build/web/app/themes/WordPressBP/assets/',
      // Replace version string (sDEV) in functions.php for cache busting
      'sed -i "s/vDEV/' + version + '/g" build/web/app/themes/WordPressBP/functions.php',
      // Uploads dir is not needed in build (will be symlinked into place on deploy)
      'rm -fr build/web/app/uploads',
      // Move into build dir, fetch composer dependencies and create tarball
      'cd build',
      'composer install',
      'tar -zcf build.tar.gz *'
    ].join('&&'),

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
    deploy_apply_build = [
      // Create new release dir
      'mkdir -p ' + deploy_release_path,
      // Extract uploaded tarball to new release dir
      'tar -zxf /tmp/build.tar.gz -C ' + deploy_release_path,
      // Symlink static files into the new release dir
      'ln -s ' + deploy_path + '/static/uploads ' + deploy_release_path + '/web/app/uploads',
      'ln -s ' + deploy_path + '/static/.env ' + deploy_release_path + '/.env',
      // Remove previous release dir
      'rm -rf ' + deploy_path + '/previous',
      // Move current release to previous
      'mv ' + deploy_path + '/current ' + deploy_path + '/previous',
      // Move new release to current
      'mv ' + deploy_release_path + ' ' + deploy_path + '/current',
      // Clean up uploaded build tarball
      'rm -f /tmp/build.tar.gz'
    ].join('&&'),

    /*
     * If something's wrong, simply revert to previous deployment.
     *
     * Rename the "current" directory to "broken" and "previous" to "current".
     * After that remove the "broken" directory.
     */
    deploy_revert = [
      // Rename symlink to current (broken) release
      'mv ' + deploy_path + '/current ' + deploy_path + '/broken',
      // Restore symlink to previous (working) release
      'mv ' + deploy_path + '/previous ' + deploy_path + '/current',
      // Remove broken release dir and symlink
      'rm -rf ' + deploy_path + '/broken'
    ].join('&&'),

    // Define a few other variables for later
    tasks_deploy,
    tasks_revert
  ;

  // Load all grunt plugins for your project
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-ssh');

  // Grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Watcher for asset compilation
    watch: {
      stylesheets: {
        files: ['web/app/themes/WordPressBP/css/**/*.scss'],
        tasks: ['sass:development', 'autoprefixer']
      },
      scriptsTop: {
        files: ['web/app/themes/WordPressBP/js/top/*.js'],
        tasks: ['concat:top']
      },
      scriptsBottom: {
        files: ['web/app/themes/WordPressBP/js/bottom/*.js'],
        tasks: ['concat:bottom']
      }
    },

    // JS concatenation
    concat: {
      options: {
        stripBanners: true,
        separator: '\n;' // Make sure single line comments don't screw up concatenation
      },
      top: {
        files: {
          'web/app/themes/WordPressBP/assets/top.js': [
            'web/app/themes/WordPressBP/js/top/*.js'
          ]
        }
      },
      bottom: {
        options: {
          banner: 'var App = App || {};' // Add App namespace at start of our JS app build
        },
        files: {
          'web/app/themes/WordPressBP/assets/bottom.js': [
            'web/app/themes/WordPressBP/js/lib/jquery/dist/jquery.min.js',
            'web/app/themes/WordPressBP/js/bottom/module1.js',
            'web/app/themes/WordPressBP/js/bottom/main.js'
          ]
        }
      }
    },

    // JS minification
    uglify: {
      options: {
        preserveComments: false
      },
      build: {
        expand: true,
        flatten: true,
        src: 'web/app/themes/WordPressBP/assets/*.js',
        dest: 'web/app/themes/WordPressBP/assets/'
      }
    },

    // Compile SASS with node libsass
    sass: {
      options: {
        imagePath: '/app/themes/WordPressBP/assets',
        precision: 5
      },
      development: {
        options: {
          sourceMap: true,
          outputStyle: 'nested'
        },
        expand: true,
        flatten: true,
        src: 'web/app/themes/WordPressBP/css/*.scss',
        dest: 'web/app/themes/WordPressBP/assets/',
        ext: '.css'
      },
      production: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        expand: true,
        flatten: true,
        src: 'web/app/themes/WordPressBP/css/*.scss',
        dest: 'web/app/themes/WordPressBP/assets/',
        ext: '.css'
      },
    },

    // Auto-add vendor prefixes to CSS if necessary
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      build: {
        expand: true,
        flatten: true,
        src: 'web/app/themes/WordPressBP/assets/*.css',
        dest: 'web/app/themes/WordPressBP/assets/'
      }
    },

    // CSS minification
    csso: {
      build: {
        expand: true,
        flatten: true,
        src: 'web/app/themes/WordPressBP/assets/*.css',
        dest: 'web/app/themes/WordPressBP/assets/'
      }
    },

    // Shell commands
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      clean: {
        command: [
        'compass clean',
        'rm -f web/app/themes/WordPressBP/assets/*.js',
        'rm -fr build'
        ].join('&&')
      },
      build: {
        command: deploy_create_build
      }
    },

    /*
     * Deploy tasks
     */
    sshconfig: deploy_env_ssh,
    /*
     * Create actual Grunt tasks for deploy. Extend with
     * other environments if necessary.
     *
     * This bit is kind of ugly because of repetition. If you know how to improve,
     * please submit a patch.
     */
    sshexec: {
      deployProduction: {
        options: { config: 'production' },
        command: deploy_apply_build
      },
      deployStaging: {
        options: { config: 'staging' },
        command: deploy_apply_build
      },
      deployDev: {
        options: { config: 'development' },
        command: deploy_apply_build
      },
      revertProduction: {
        options: { config: 'production' },
        command: deploy_revert
      },
      revertStaging: {
        options: { config: 'staging' },
        command: deploy_revert
      },
      revertDev: {
        options: { config: 'development' },
        command: deploy_revert
      }
    },
    sftp: {
      options: {
        path: '/tmp/',
        srcBasePath: 'build/'
      },
      uploadProduction: {
        options: { config: 'production' },
        files: { './': ['build/build.tar.gz'] }
      },
      uploadStaging: {
        options: { config: 'staging' },
        files: { './': ['build/build.tar.gz'] }
      },
      uploadDev: {
        options: { config: 'development' },
        files: { './': ['build/build.tar.gz'] }
      }
    }

  });

  /*
   * Call different deploy tasks based on environment with some IFs. Extend with
   * other environments if necessary.
   */
  if(deploy_env == 'production') {
    tasks_deploy = [
      'sftp:uploadProduction',
      'sshexec:deployProduction'
    ];
    tasks_revert = [
      'sshexec:revertProduction'
    ];
  } else if(deploy_env == 'staging') {
    tasks_deploy = [
      'sftp:uploadStaging',
      'sshexec:deployStaging'
    ];
    tasks_revert = [
      'sshexec:revertStaging'
    ];
  } else {
    tasks_deploy = [
      'sftp:uploadDev',
      'sshexec:deployDev'
    ];
    tasks_revert = [
      'sshexec:revertDev'
    ];
  }

  /*
   * Set up tasks' aliases
   */
  grunt.registerTask('default',       ['concat', 'sass:development', 'autoprefixer']);
  grunt.registerTask('production',    ['concat', 'uglify', 'sass:production', 'autoprefixer', 'csso']);
  grunt.registerTask('deploy',        ['shell:clean', 'concat', 'uglify', 'sass', 'autoprefixer', 'csso', 'shell:build'].concat(tasks_deploy));
  grunt.registerTask('deploy-revert', tasks_revert);
  grunt.registerTask('clean',         ['shell:clean']);

}
