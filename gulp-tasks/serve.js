var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});
var bs = require('browser-sync').create();

var buildConfig = require('../buildConfig');
var colors = require('colors');
var argv = require('yargs').argv;
var config = require('../config');

module.exports = function() {

  gulp.task('serve',
    'start the Kibibit Code Editor server',
    ['styles'],
    function() {
      plugins.developServer.listen(buildConfig.options.server);

      return gulp.src(__filename)
        .pipe(plugins.open({uri: 'http://localhost:' + config.port}));
    }
  );

  gulp.task('serve:dist',
    'start the Kibibit Code Editor server (muglified)',
    ['dist'],
    function() {
      plugins.developServer.listen(buildConfig.options.distServer);

      return gulp.src(__filename)
        .pipe(plugins.open({uri: 'http://localhost:' + config.port}));
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
            bs.init(buildConfig.options.bs, function() {
              plugins.util.log(
                plugins.util.colors.bold('browser-sync: '),
                plugins.util.colors.magenta('http://localhost:'
                  + buildConfig.options.bs.port));
              plugins.util.log(
                plugins.util.colors.bold('browser-sync Management: '),
                plugins.util.colors.magenta('http://localhost:'
                  + buildConfig.options.bs.ui.port));
            });
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
