module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			options: {
				outputStyle: 'compressed',
				sourceMap: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'css/src/',
					src: ['**/*.scss'],
					dest: 'css/tmp/',
					ext: '.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				map: true,
			},
			dist: {
				options: {
					browsers: ['> 1%', 'last 2 version', 'ie 9', 'android 2.1', 'android 2.2', 'android 2.3', 'android 4']
				},
				files: {
					'css/yes.css': 'css/tmp/yes.css',
					'css/no.css': 'css/tmp/no.css',
				}
			}
		},

		watch: {
			options: {
				livereload: true,
			},
			scss: {
				files: ['css/src/**/*.scss'],
				tasks: ['compilescss'],
				options: {
					livereload: false,
				},
			},
			js: {
				files: ['js/src/**/*.js'],
				tasks: ['uglify']
			},
			css: {
				files: ['css/*.css'],
				tasks: []
			},
			html: {
				files: ['nimbus-local/templates/**/*.html'],
				tasks: []
			}
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('compilescss', ['sass:dist', 'autoprefixer:dist']);

	grunt.registerTask('default', ['compilescss']);
};
