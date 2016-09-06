// grab our packages
var gulp = require('gulp-help')(require('gulp'), {
  description: 'you are looking at it.',
  aliases: ['h'],
  hideEmpty: true
});
var colors = require('colors');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});
var argv = require('yargs').argv;
var buildConfig = require('./buildConfig');

require('./gulp-tasks/cache')();
require('./gulp-tasks/test')();
require('./gulp-tasks/lint')();
require('./gulp-tasks/styles')();
require('./gulp-tasks/analyzeCode')();
require('./gulp-tasks/serve')();
require('./gulp-tasks/size')();
require('./gulp-tasks/dist')();

// gulp.task('depcheck',
//   'checks for unused dependencies ' + colors.blue('(including devs)'),
//   depcheck({
//     ignoreDirs: ['test', 'logs'],
//     ignoreMatches: ['karma-*', 'jscs-*', 'jasmine-*']
//   })
// );

// define the default task and add the watch task to it
gulp.task('default',
  colors.bgCyan.black('gulp') + ' === ' + colors.bgCyan.black('gulp watch'),
  ['watch']);
