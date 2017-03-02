/*
	Dutchwebworks Grunt boilerplate, april 2015
	https://github.com/dutchwebworks/grunt-boilerplate
*/

module.exports = function(grunt) {

	/**********************************************************************
	1. Load all Grunt dependency NPM packages listed in `package.json`
	**********************************************************************/

	// Grunt load tasks https://www.npmjs.org/package/load-grunt-tasks
	require('load-grunt-tasks')(grunt, {
		config: './package.json',
		scope: 'devDependencies'
	});

	// Display the elapsed execution time of grunt tasks
	require('time-grunt')(grunt);
	
	/**********************************************************************
	2. Configure Grunt tasks and their targets
	**********************************************************************/

	grunt.initConfig({
		pkg: grunt.file.readJSON('./package.json'),

		config: {
			projectRoot: './httpdocs',
		},

		meta: {
			banner: '/*!\n' +
				' * ' + 'Name: <%= pkg.name %>\n' +
				' * ' + 'Author: <%= pkg.author %>\n' +
				' * ' + 'Version: <%= pkg.version %>\n' +
				' * ' + 'Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' */\n'
			,
		},

		watch: {
			scss: {
				options: {
					spawn: false
				},
				files: '<%= config.projectRoot %>/sass/**/*.scss',
				tasks: ['newer:sass:dev']
			}
		},

		sass: {
			dev: {
				options: {
					outputStyle: 'expanded',
					sourceMap: true,
				},
				files: [{
					expand: true,
					cwd: '<%= config.projectRoot %>/sass',
					src: ['*.scss'],
					dest: '<%= config.projectRoot %>/css',
					ext: '.css',
				}]
			},
			dist: {
				options: {
					outputStyle: 'expanded',
					sourceMap: false,
				},
				files: [{
					expand: true,
					cwd: '<%= config.projectRoot %>/sass',
					src: ['*.scss'],
					dest: '<%= config.projectRoot %>/css',
					ext: '.css',
				}]
			}
		},

		cssmin: {
			style: {
				files: {
					'<%= config.projectRoot %>/css/style.min.css': [
						'<%= config.projectRoot %>/css/style.css'
						// '<%= config.projectRoot %>/css/another.css'
					]
				}
			}
		},

		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: '<%= config.projectRoot %>/img',
					src: ['./**/*.{png,jpg,gif}'],
					dest: '<%= config.projectRoot %>/img'
				}]				
			}
		},

		svgmin: {
			options: {
				plugins: [{
					removeViewBox: false,
					removeUselessStrokeAndFill: false
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.projectRoot %>/img',
					src: ['./**/*.svg'],
					dest: '<%= config.projectRoot %>/img'
					// ext: '.min.svg'
				}]
			}
		},

		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			target: {
				src: '<%= config.projectRoot %>/js/*.js'
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: [
					'<%= config.projectRoot %>/js/libs/jquery-2.1.0.js',
					'<%= config.projectRoot %>/js/libs/modernizr-2.7.1.js',
					'<%= config.projectRoot %>/js/common.js'
				],
				dest: '<%= config.projectRoot %>/js/common.concat.js'
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			common: {
				options: {
					// sourceMap: true,
					sourceMapName: '<%= config.projectRoot %>/js/common.js.map'
				},
				src: '<%= config.projectRoot %>/js/common.concat.js',
				dest: '<%= config.projectRoot %>/js/common.min.js',	
			}
		},

		usebanner: {
			banner: {
				options: {
					position: 'top',
					banner: '<%= meta.banner %>',
					linebreak: true
				},
				files: {
					src: ['<%= config.projectRoot %>/css/style.min.css']
				}
			}
		},

		browserSync: {
			dev: {
				options: {
					watchTask: true,
					debugInfo: true,
					excludedFileTypes: ["map"],
					ghostMode: {
						clicks: false,
						scroll: false,
						links: false,
						forms: false
					},
					// Use either the proxy or server setting
					// proxy: 'grunt-test.local.cassius.nl'
					server: {
						baseDir: '<%= config.projectRoot %>'
					}
				},	
				bsFiles: {
					src: [
						'<%= config.projectRoot %>/css/**/*.css',
						'<%= config.projectRoot %>/js/**/*.js',
						'<%= config.projectRoot %>/**/*.html',
						'<%= config.projectRoot %>/**/*.shtml'
					]	
				}				
			}
		},

		// Grunt clean https://www.npmjs.org/package/grunt-contrib-clean
		clean: {
			cssmap: {
				src: ['<%= config.projectRoot %>/css/**/*.map'],
				filter: 'isFile'
			},
			jsmap: {
				src: ['<%= config.projectRoot %>/js/**/*.map'],
				filster: 'isFile'
			},
			jsconcat: {
				src: ['<%= config.projectRoot %>/js/**/*.concat.js'],
				filter: 'isFile'
			}
		}
	});

	/**********************************************************************
	3. Registered Grunt tasks
	**********************************************************************/

	grunt.registerTask('serve', [
		'browserSync',
		 'watch'
	]);

	grunt.registerTask('build-sass', [
		'sass:dist',
		'newer:cssmin',
		'usebanner'
	]);

	grunt.registerTask('build-js', [
		'newer:concat',
		'newer:uglify',
		'clean:jsconcat'
	]);

	grunt.registerTask('build-img', [
		'newer:imagemin',
		'newer:svgmin'
	]);

	grunt.registerTask('default', [
		'build-sass',
		'build-js',
		'build-img',
		'clean'
	]);
};