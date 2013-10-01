/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		// Task configuration.
		uglify: {
			all: {
				files: {
					'pict.min.js': [
						'src/api.js',
						'src/controlbar.js',
						'src/slider.js',
						'src/signal.js',
						'src/util.js'
					]
				}
			}
		},
		sass: {
			all: {
				files: {
					'pict.css': 'scss/pict.scss'
				}
			}
		},
		watch: {
			css: {
				files: 'scss/*.scss',
				tasks: ['sass'],
				options: {
					livereload: true
				}
			},
			js: {
				files: 'src/*.js',
				tasks: ['uglify'],
				options: {
					livereload: true
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['uglify', 'sass']);
};
