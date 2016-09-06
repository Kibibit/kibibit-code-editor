var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});
var bs = require('browser-sync').create();

var buildConfig = require('../buildConfig');
var colors = require('colors');

module.exports = function() {

  gulp.task('serve',
    'start the Kibibit Code Editor server',
    ['styles'],
    function() {
      plugins.developServer.listen(buildConfig.options.server);
    }
  );

  gulp.task('serve:dist',
    'start the Kibibit Code Editor server (muglified)',
    ['dist'],
    function() {
      plugins.developServer.listen(buildConfig.options.distServer);
    }
  );

  gulp.task('debug',
    'debug the project using ​' + colors.blue('~= node-inspector =~'),
    ['styles'],
    plugins.shell.task(['node-debug server.js'])
  );

  gulp.task('watch',
    'start the Kibibit Code Editor '
      + colors.blue('Development')
      + ' server',
    ['styles', 'cache:jscpd', 'cache:magicNumbers', 'cache:linting'],
    function () {
      buildConfig.flags.watch = true;

      plugins.developServer.listen(buildConfig.options.server,
        function (error) {
          if (!error)
            bs.init(buildConfig.options.bs);
        }
      );

      gulp.watch(buildConfig.FILES.FRONTEND_SASS, ['styles']);
      gulp.watch(buildConfig.FILES.JS_ALL, ['analyzeCode']);
      gulp.watch(!argv.disableLint ?
        buildConfig.FILES.LINT_JS : [], ['lint:js']);
      gulp.watch(!argv.disableLint ?
        buildConfig.FILES.FRONTEND_SASS : [], ['lint:sass']);

      gulp.watch(buildConfig.FILES.FRONTEND_JS).on('change', bs.reload);

      gulp.watch(buildConfig.FILES.FRONTEND_HTML).on('change', bs.reload);
    }, {
      options: {
        'disableLint': '  don\'t output lint errors'
      }
    }
  );
};
