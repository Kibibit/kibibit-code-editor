var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

var buildConfig = require('../buildConfig');
var colors = require('colors');
var argv = require('yargs').argv;

module.exports = function() {

  gulp.task('size',
    'Show sizes for both Development & Distribution folders',
    ['size:dev', 'size:dist'],
    function() {},
    {
      options: {
        'detailed': '  will include output from linter only for changed files'
      }
    }
  );

	                    gulp.task('size:dev', function() {
	                      return gulp.src('./public/index.html')
	  	.pipe(plugins.plumber(buildConfig.options.plumber))
	    .pipe(plugins.assets({
	                          js: true,
	                          css: true
	    }))
	    .pipe(plugins.size({
  title: 'Development:',
	                          gzip: false,
	                          showFiles: argv.detailed ? true : false
	    }));
	});

	                    gulp.task('size:dist', function() {
	                      return gulp.src('./public/dist/index.html')
	  	.pipe(plugins.plumber(buildConfig.options.plumber))
	    .pipe(plugins.assets({
	                          js: true,
	                          css: true
	    }))
	    .pipe(plugins.size({
  title: 'Distribution:',
	                          gzip: false,
	                          showFiles: argv.detailed ? true : false
	    }));
	});
};
