module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	// Custom variables
	var
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
			stylesheets: {
				files: ['themes/WordPressBP/css/**/*.scss'],
				tasks: ['shell:compassDev', 'autoprefixer']
			},
			scripts1: {
				files: ['themes/WordPressBP/js/head/*.js'],
				tasks: ['uglify']
			},
			scripts2: {
				files: [
					'themes/WordPressBP/js/*.js',
					'themes/WordPressBP/js/**/*.js',
					'!themes/WordPressBP/js/head/*.js'
				],
				tasks: ['requirejs:concat']
			}
		},

		uglify: {
			options: {
				preserveComments: 'some'
			},
			build: {
				files: {
					'themes/WordPressBP/assets/top.js': [
						'themes/WordPressBP/js/head/head.js'
					]
				}
			}
		},

		requirejs: {
			options: {
				baseUrl: 'themes/WordPressBP/js',
				mainConfigFile: 'themes/WordPressBP/js/main.js',
				name: 'main',
				out: 'themes/WordPressBP/assets/bottom.js',
				include: ['lib/requirejs/require']
			},
			concat: {
				options: {
					optimize: 'none'
				}
			},
			uglify: {
				optimize: 'uglify2'
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
				src: 'themes/WordPressBP/assets/*.css',
				dest: 'themes/WordPressBP/assets/'
			}
		},

		csso: {
			// This will optimize all .css files at src
			build: {
				expand: true,
				flatten: true,
				src: 'themes/WordPressBP/assets/*.css',
				dest: 'themes/WordPressBP/assets/'
			}
		},

		shell: {
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
				'rm -f themes/WordPressBP/assets/*.js',
				'rm -fr build'
				].join('&&')
			},
			build: {
				command: [
				'mkdir build',
				'git archive --format=tar master | tar -x -C build',
				'cp themes/WordPressBP/assets/*.js build/themes/WordPressBP/assets/',
				'cp themes/WordPressBP/assets/*.css build/themes/WordPressBP/assets/',
				'sed -i "s/vDEV/' + version + '/g" build/themes/WordPressBP/functions.php',
				'cd build',
				'tar -zcf build.tar.gz *'
				].join('&&')
			}
		},

		sshconfig: {
			'production': {
				host: deploy_ip,
				port: deploy_port,
				username: deploy_user,
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

	grunt.registerTask('default', ['uglify', 'requirejs:concat', 'shell:compassDev', 'autoprefixer']);
	grunt.registerTask('production', ['uglify', 'requirejs:uglify', 'shell:compassProd', 'autoprefixer', 'csso']);
	grunt.registerTask('clean', ['shell:clean']);
	grunt.registerTask('deploy', ['shell:clean', 'uglify', 'requirejs:uglify', 'shell:compassProd', 'autoprefixer', 'csso', 'shell:build', 'sshexec:backup', 'sftp:uploadBuild', 'sshexec:applyBuild']);
	grunt.registerTask('deploy-revert', ['sshexec:revert']);

}
