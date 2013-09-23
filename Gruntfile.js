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
						'src/Sub.js',
						'src/main.js',
						'src/api.js',
						'src/controls.js',
						'src/progress.js'
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
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['uglify', 'sass']);
};
