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

gulp.task( 'server:start', function() {
    plugins.developServer.listen( buildConfig.options.server );
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

gulp.task( 'cache:jscpd',
  preCacheGulpCached(buildConfig.FILES.JS_ALL, 'jscpd', function() {
    plugins.util.log('gulp-cached pre-cache complete for '
      + plugins.util.colors.blue('jscpd'.toUpperCase()));
  })
);

gulp.task( 'cache:magicNumbers',
  preCacheGulpCached(buildConfig.FILES.JS_ALL, 'magicNumbers', function() {
    plugins.util.log('gulp-cached pre-cache complete for '
      + plugins.util.colors.blue('magicNumbers'.toUpperCase()));
  })
);

gulp.task( 'cache:linting',
  preCacheGulpCached(buildConfig.FILES.LINT, 'linting', function() {
    plugins.util.log('gulp-cached pre-cache complete for '
      + plugins.util.colors.blue('linting'.toUpperCase()));
  }, !argv.lint)
);

function preCacheGulpCached(src, cacheId, cb, skip) {
  return function preCache() {
    if (skip) {
      return;
    }
    /* Pre-build a cache for gulp-cached plugin */
    var callCallback = true;
    return gulp.src(src)
      .pipe(plugins.cached(cacheId))
      .pipe(plugins.callback(function() {
        if (callCallback && cb) {
          cb();
          callCallback = false;
        }
      }));
  };
};
