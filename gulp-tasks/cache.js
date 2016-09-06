var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});
var argv = require('yargs').argv;
var buildConfig = require('../buildConfig');

module.exports = function() {

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
    preCacheGulpCached(buildConfig.FILES.LINT_JS, 'linting', function() {
      plugins.util.log('gulp-cached pre-cache complete for '
        + plugins.util.colors.blue('linting'.toUpperCase()));
    }, argv.disableLint)
  );

  function preCacheGulpCached(src, cacheId, cb, skip) {
    return function preCache() {
      if (skip) {
        return;
      }
      /* Pre-build a cache for gulp-cached plugin */
      var callCallback = true;
      return gulp.src(src)
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.cached(cacheId))
        .pipe(plugins.callback(function() {
          if (callCallback && cb) {
            cb();
            callCallback = false;
          }
        }));
    };
  }

};
