module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	// Custom variables
	var
		theme = 'WordPressBP',
		version = Math.round(+new Date()/1000), // cache-bust timestamp

		// Use Grunt to deploy the code
		deploy_ip = '127.0.0.1',
		deploy_port = 22,
		deploy_user = 'root',
		deploy_path = '/var/www/project/webdir/code' // remote path
	;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			scripts: {
				files: ['themes/' + theme + '/js/**/*.js'],
				tasks: ['concat']
			},
			stylesheets: {
				files: ['themes/' + theme + '/css/**/*.scss'],
				tasks: ['shell:compassDev', 'autoprefixer']
			}
		},

		concat: {
			options: {
				stripBanners: true,
				separator: ';'
			},
			scripts1: {
				'themes/' + theme + '/assets/app.js': [
					'theme/' + theme + '/js/app/global.js',
					// More files to concat to app.js
				]
			},
			// More script files
		},

		uglify: {
			options: {
				preserveComments: false
			},
			// This will uglify all .js files at src
			build: {
				expand: true,
				flatten: true,
				src: 'themes/' + theme + '/assets/*.js',
				dest: 'themes/' + theme + '/assets/'
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9']
			},
			// This will autoprefix all .css files at src
			build: {
				expand: true,
				flatten: true,
				src: 'themes/' + theme + '/assets/*.css',
				dest: 'themes/' + theme + '/assets/'
			}
		},

		csso: {
			// This will optimize all .css files in src
			build: {
				expand: true,
				flatten: true,
				src: 'themes/' + theme + '/assets/*.css',
				dest: 'themes/' + theme + '/assets/'
			}
		},

		shell: {
			options: {
				options: {
					stdout: true,
					stderr: true
				},
				compassDev: {
					command: 'compass compile --force'
				},
				compassProd: {
					command: 'compass compile -e production --force'
				},
				clean: {
					command: [
					'compass clean',
					'rm -f themes/' + theme + '/assets/*.js',
					'rm -fr build'
					].join('&&')
				},
				build: {
					command: [
					'mkdir build',
					'git archive --format=tar master | tar -x -C build',
					'cp themes/' + theme + '/assets/*.js build/themes/' + theme + '/assets/',
					'cp themes/' + theme + '/assets/*.css build/themes/' + theme + '/assets/',
					'sed -i "s/vDEV/' + version + '/g" build/themes/' + theme + '/functions.php',
					'cd build',
					'tar -zcf build.tar.gz *'
					].join('&&')
				}
			}
		},

		sshconfig: {
			'production': {
				host: deploy_ip,
				port: deploy_port,
				username: deploy_username,
				agent: process.env.SSH_AUTH_SOCK
			}
		},
		sshexec: {
			backup: {
				options: { config: 'production' },
				command: 'cd ' + deploy_path + ' && mv -f build.tar.gz previous.tar.gz'
			},
			applyBuild: {
				options: { config: 'production' },
				command: 'cd ' + deploy_path + ' && tar -zxf build.tar.gz'
			},
			revert: {
				options: { config: 'production' },
				command: 'cd ' + deploy_path + ' && tar -zxf previous.tar.gz'
			}
		},
		sftp: {
			uploadBuild: {
				options: {
					config: 'production',
					path: deploy_path,
					srcBasePath: 'build/'
				},
				files: {
					'./': ['build/build.tar.gz']
				}
			}
		}

	});

	grunt.registerTask('default', ['concat', 'shell:compassDev', 'autoprefixer']);
	grunt.registerTask('production', ['concat', 'uglify', 'shell:compassProd', 'autoprefixer', 'csso']);
	grunt.registerTask('clean', ['shell:clean']);
	grunt.registerTask('deploy', ['shell:clean', 'concat', 'uglify', 'shell:compassProd', 'autoprefixer', 'csso', 'shell:build', 'sshexec:backup', 'sftp:uploadBuild', 'sshexec:applyBuild']);
	grunt.registerTask('deploy-revert', ['sshexec:revert']);

}