// grab our packages
var gulp = require('gulp-help')(require('gulp'), {
  description: 'you are looking at it.',
  aliases: ['h']
}),
colors = require('colors'),
beautify = require('gulp-jsbeautifier'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
cssnano = require('gulp-cssnano'),
rename = require('gulp-rename'),
prettify = require('gulp-jsbeautifier'),
jshint = require('gulp-jshint'),
concat = require('gulp-concat'),
livereload = require('gulp-livereload'),
server = require('gulp-develop-server'),
shell = require('gulp-shell'),
jscs = require('gulp-jscs'),
argv = require('yargs').argv,
cache = require('gulp-cached'),
gutil = require('gulp-util'),
depcheck = require('gulp-depcheck');

var karma = require('karma').server;

var isTravis = process.env.TRAVIS || false;

var indent = '                        ';
var options = {
  path: './server.js'
};
var FILES = {};
FILES.FRONTEND_JS = ['./public/app/**/*.js'];
FILES.FRONTEND_HTML = ['./public/app/**/*.html'];
FILES.FRONTEND_SASS = ['./public/assets/sass/**/*.scss'];
FILES.FRONTEND_ALL = [].concat(FILES.FRONTEND_JS, FILES.FRONTEND_HTML, FILES.FRONTEND_SASS);
FILES.SERVER_MAIN = ['./server.js'];
FILES.SERVER_JS_WITHOUT_MAIN = ['./app/**/*.js', './config.js'];
FILES.SERVER_JS = [].concat(FILES.SERVER_MAIN, FILES.SERVER_JS_WITHOUT_MAIN);
FILES.BUILD_FILES = ['./gulpfile.js'];
FILES.JS_ALL = [].concat(FILES.FRONTEND_JS, FILES.SERVER_JS);
FILES.LINT = [].concat(FILES.FRONTEND_JS, FILES.SERVER_JS_WITHOUT_MAIN);

// define the default task and add the watch task to it
gulp.task('default', colors.bgCyan.black('gulp') + ' === ' + colors.bgCyan.black('gulp watch'), ['watch']);

gulp.task('test', 'run all tests using karma locally, and travis-ci on GitHub',
  function(done) {
    console.log('isTravis', isTravis);
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: isTravis
    }, done);
  }
);

gulp.task('depcheck', 'checks for unused dependencies ' + colors.blue('(including devs)'),
  depcheck({
    ignoreDirs: [ 'test', 'logs' ],
    ignoreMatches: ['karma-*', 'jscs-*', 'jasmine-*']
  })
);

// configure the jshint task
gulp.task('lint-js', 'lint ' + colors.blue('all JS') + ' files in the following paths:\n' + indent +
    colors.yellow(FILES.JS_ALL.join(',\n' + indent)),
    function() {
      return gulp.src(FILES.JS_ALL)
          .pipe(cache('linting'))
          .pipe(jscs())
          .pipe(jscs.reporter())
          .pipe(jscs.reporter('fail'));
    });

gulp.task('lint-sass', 'lint ' + colors.blue('all SASS') + ' files in the following paths:\n' + indent +
    colors.yellow(FILES.FRONTEND_SASS.join(',\n' + indent)),
    function() {
      return gulp.src(FILES.FRONTEND_SASS)
          .pipe(cache('linting'))
          .pipe(sass().on('error', sass.logError));
    });

gulp.task('lint', 'lint ' + colors.blue('all javascript and sass') + ' files', ['lint-js', 'lint-sass']);

gulp.task('format-front-end', 'formats the FE files in the following paths:\n' + indent +
    colors.yellow(FILES.FRONTEND_JS.join(',\n' + indent)),
    function() {
      return gulp.src([].concat(FILES.FRONTEND_JS), {
        base: 'public'
      })
      .pipe(cache('formating'))
            .pipe(jscs({
              fix: true
            }))
            .pipe(jscs.reporter())
            .pipe(gulp.dest('./public')); // add this to a different folder in order to test first
    });

gulp.task('format-server', 'formats the BE files in the following paths:\n' + indent +
    colors.yellow([].concat(FILES.SERVER_JS, FILES.BUILD_FILES).join(',\n' + indent)),
    function() {
      return gulp.src([].concat(FILES.SERVER_JS, FILES.BUILD_FILES), {
        base: '.'
      })
      .pipe(cache('formating'))
            .pipe(jscs({
              fix: true
            }))
            .pipe(jscs.reporter())
            .pipe(gulp.dest('.'));
    });

gulp.task('format', 'formats ' + colors.blue('all') + ' the project\'s javascript files', ['format-server', 'format-front-end']);

gulp.task('styles', 'compile SASS to CSS', function() {
  return gulp.src(FILES.FRONTEND_SASS)
      .pipe(sourcemaps.init())
      .pipe(concat('style.css'))
      .pipe(sass().on('error', sass.logError))
      //.pipe(cssnano())
      .pipe(sourcemaps.write())
      //.pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./public/assets/css/'));
});

gulp.task('serve', 'start the Kibibit Code Editor server', ['styles'], function() {
  server.listen(options, livereload.listen);
});

gulp.task('debug', 'debug the project using ​' + colors.blue('~= node-inspector =~'), ['styles'], shell.task(['node-debug server.js']));

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

      gulp.watch(argv.lint ? FILES.LINT : [], ['lint-js']);
      gulp.watch(FILES.FRONTEND_SASS, ['styles']);
      gulp.watch(FILES.SERVER_JS).on('change', restart);
      gulp.watch(FILES.FRONTEND_ALL).on('change', function(file) {
        reloadBrowser('Frontend file changed.', file.path);
      });
    }, {
      options: {
        'lint': 'will include output from linter only for changed files'
      }
    });
