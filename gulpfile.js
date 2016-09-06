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
gulp.task('default', colors.bgCyan.black('gulp') + ' === ' + colors.bgCyan.black('gulp watch'), ['watch']);

gulp.task( 'server:start', ['styles'], function() {
    plugins.developServer.listen( buildConfig.options.server, plugins.livereload.listen );
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', 'first, will compile SASS and run the server. ' +
    'Then, it watches changes and do some live dev work',
    ['server:start', 'cache:jscpd', 'cache:magicNumbers', 'cache:linting'],
    function() {

      function reloadBrowser(message, path) {
        plugins.util.log(message ? message : 'Something changed.',
          plugins.util.colors.bgBlue.white.bold('Reloading browser...'));
        plugins.livereload.changed(path);
      }

      buildConfig.flags.watch = true;

      gulp.watch(argv.lint ? buildConfig.FILES.LINT : [], ['lint:js']);
      gulp.watch(buildConfig.FILES.JS_ALL, ['analyzeCode']);
      gulp.watch(buildConfig.FILES.FRONTEND_SASS, ['styles', 'lint:sass']);
      gulp.watch(buildConfig.FILES.SERVER_JS).on('change', plugins.developServer.restart);
      gulp.watch(buildConfig.FILES.FRONTEND_ALL).on('change', function(file) {
        reloadBrowser('Frontend file changed.', file.path);
      });
    }, {
      options: {
        'lint': '  will include output from linter only for changed files'
      }
    });
