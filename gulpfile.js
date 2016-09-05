// grab our packages
var gulp = require('gulp-help')(require('gulp'), {
  description: 'you are looking at it.',
  aliases: ['h'],
  hideEmpty: true
}),
colors = require('colors'),
beautify = require('gulp-jsbeautifier'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
cssnano = require('gulp-cssnano'),
rename = require('gulp-rename'),
prettify = require('gulp-jsbeautifier'),
concat = require('gulp-concat'),
livereload = require('gulp-livereload'),
server = require('gulp-develop-server'),
shell = require('gulp-shell'),
jscs = require('gulp-jscs'),
argv = require('yargs').argv,
cache = require('gulp-cached'),
gutil = require('gulp-util'),
depcheck = require('gulp-depcheck'),
jscpd = require('gulp-jscpd'),
complexity = require('gulp-complexity'),
buddyjs = require('gulp-buddy.js'),
size = require('gulp-filesize');

var buildConfig = require('./buildConfig');

var karma = require('karma').server;

var isTravis = process.env.TRAVIS || false;

var indent = '                        ';
var options = {
  path: './server.js'
};

require('./gulp-tasks/test')();
require('./gulp-tasks/lint')();
require('./gulp-tasks/styles')();
require('./gulp-tasks/analyzeCode')();
require('./gulp-tasks/dist')();

// gulp.task('depcheck',
//   'checks for unused dependencies ' + colors.blue('(including devs)'),
//   depcheck({
//     ignoreDirs: ['test', 'logs'],
//     ignoreMatches: ['karma-*', 'jscs-*', 'jasmine-*']
//   })
// );

gulp.task('serve', 'start the Kibibit Code Editor server', ['styles'], function() {
  server.listen(options, livereload.listen);
});

gulp.task('debug', 'debug the project using ​' + colors.blue('~= node-inspector =~'), ['styles'], shell.task(['node-debug server.js']));

gulp.task('sizes', function() {
  return gulp.src('./public/app/**/*')
    //all your gulp tasks
    // .pipe(gulp.dest('./dist/')
    .pipe(size()) // [gulp] Size example.css: 265.32 kB  
});

// define the default task and add the watch task to it
gulp.task('default', colors.bgCyan.black('gulp') + ' === ' + colors.bgCyan.black('gulp watch'), ['watch']);

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', 'first, will compile SASS and run the server.\n' + indent +
    'Then, it watches changes and do the following things when needed:\n' + indent +
    colors.yellow('  1.') + ' compile SASS\n' + indent +
    colors.yellow('  2.') + ' restart server\n' + indent +
    colors.yellow('  3.') + ' reload browser', ['serve'],
    function() {
      function restart(file) {
        server.changed(function(error) {
          if (!error) {
            reloadBrowser('Backend file changed.', file.path);
          }
        });
      }

      function reloadBrowser(message, path) {
        gutil.log(message ? message : 'Something changed.', gutil.colors.bgBlue.white.bold('Reloading browser...'));
        livereload.changed(path);
      }

      gulp.watch(argv.lint ? buildConfig.FILES.LINT : [], ['lint-js']);
      gulp.watch(buildConfig.FILES.JS_ALL, ['jscpd', 'magicNumbers']);
      gulp.watch(buildConfig.FILES.FRONTEND_SASS, ['styles']);
      gulp.watch(buildConfig.FILES.SERVER_JS).on('change', restart);
      gulp.watch(buildConfig.FILES.FRONTEND_ALL).on('change', function(file) {
        reloadBrowser('Frontend file changed.', file.path);
      });
    }, {
      options: {
        'lint': 'will include output from linter only for changed files'
      }
    });
