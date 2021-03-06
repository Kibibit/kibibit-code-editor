// grab our packages
var gulp = require('gulp-help')(require('gulp'), {
  description: 'you are looking at it.',
  aliases: [ 'h' ],
  hideEmpty: true
});
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

require('./gulp-tasks/cache')();
require('./gulp-tasks/test')();
require('./gulp-tasks/lint')();
require('./gulp-tasks/styles')();
require('./gulp-tasks/analyzeCode')();
require('./gulp-tasks/serve')();
require('./gulp-tasks/size')();
require('./gulp-tasks/dist')();
require('./gulp-tasks/docs')();

gulp.task('default',
  plugins.util.colors.bgCyan.black('gulp') +
    ' === ' +
    plugins.util.colors.bgCyan.black('gulp watch'),
  [ 'watch' ]);
