var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

var buildConfig = require('../buildConfig');
var stripAnsi = require('strip-ansi');

module.exports = function() {
  gulp.task('analyzeCode',
    'run all sort of checks on styleguides and complexity',
    ['jscpd', 'magicNumbers']
  );

  gulp.task('jscpd',
    //'finds out duplicate part of codes inside your project',
    function() {
      plugins.notify.logLevel(0);

      return gulp.src(
        [].concat(
          buildConfig.FILES.LINT_JS,
          buildConfig.FILES.FRONTEND_SASS))
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.if(buildConfig.flags.watch,
          plugins.cached('jscpd')))
        .pipe(plugins.jscpd({
          'min-lines': 10,
          verbose: true
        }))
        .on('error', buildConfig.flags.watch
          ? plugins.notify.onError(function(error) {
            return stripAnsi(error.message);
          }) : function() {});
    }
  );

  gulp.task('magicNumbers',
    //'shows you if you have any magic numbers
    //  + '(numbers that are used inline in javascript)',
    function () {
      return gulp.src(buildConfig.FILES.JS_ALL)
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.if(buildConfig.flags.watch,
          plugins.cached('magicNumbers')))
        .pipe(plugins.buddy({
          reporter: 'detailed'
        }))
        .on('error', buildConfig.flags.watch ?
          plugins.notify.onError(function(error) {
            return 'found new magic numbers!';
          }) : function() {});
    }
  );

  // gulp.task('depcheck',
  //   'checks for unused dependencies ' + colors.blue('(including devs)'),
  //   depcheck({
  //     ignoreDirs: ['test', 'logs'],
  //     ignoreMatches: ['karma-*', 'jscs-*', 'jasmine-*']
  //   })
  // );

};
