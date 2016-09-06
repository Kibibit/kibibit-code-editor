var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

var buildConfig = require('../buildConfig');
var colors = require('colors');

module.exports = function() {

	gulp.task('serve',
		'start the Kibibit Code Editor server',
		['styles'],
		function() {
			plugins.developServer.listen(buildConfig.options.server, plugins.livereload.listen);
		}
	);

	gulp.task('debug',
		'debug the project using ​' + colors.blue('~= node-inspector =~'),
		['styles'],
		plugins.shell.task(['node-debug server.js'])
	);
};
