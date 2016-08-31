// grab our packages
var gulp = require('gulp-help')(require('gulp'), {
    description: 'you are looking at it.',
    aliases: ['h'],
    hideEmpty: true
  });
var SubTask = require('gulp-subtask')(require('gulp'));
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

var colors = require('colors'),
  styleguide = require('sc5-styleguide'),
  argv = require('yargs').argv,
  search = require('recursive-search'),
  fs = require('fs');

var bs = require('browser-sync').create();

var options = {
  server: {
    path: './server.js',
    execArgv: ['--harmony']
  },
  bs: {
    proxy: {
      target: 'http://localhost:3141',
      middleware: function (req, res, next) {
        console.log(req.url);
        next();
      }
    },
    files: ['./public/**/*'], // files to watch with bs instantly (.ejs & .css)
    logLevel: 'silent'
  }
};

var karma = require('karma').server;

var isTravis = process.env.TRAVIS || false;

var indent = '                        ';
var FILES = {};
FILES.FRONTEND_JS = ['./public/app/**/*.js'];
FILES.FRONTEND_HTML = ['./public/app/**/*.html'];
FILES.FRONTEND_SASS = ['./public/assets/sass/**/*.scss', '!**/_init.scss'];
FILES.MAIN_SASS = ['./public/assets/sass/style.scss'];
FILES.FRONTEND_ALL = [].concat(FILES.FRONTEND_JS, FILES.FRONTEND_HTML, FILES.FRONTEND_SASS);
FILES.SERVER_MAIN = ['./server.js'];
FILES.SERVER_JS_WITHOUT_MAIN = ['./app/**/*.js', './config.js'];
FILES.SERVER_JS = [].concat(FILES.SERVER_MAIN, FILES.SERVER_JS_WITHOUT_MAIN);
FILES.BUILD_FILES = ['./gulpfile.js'];
FILES.JS_ALL = [].concat(FILES.FRONTEND_JS, FILES.SERVER_JS);
FILES.LINT = [].concat(FILES.FRONTEND_JS, FILES.SERVER_JS_WITHOUT_MAIN);

// define the default task and add the watch task to it
gulp.task('default', colors.bgCyan.black('gulp') + ' === ' + colors.bgCyan.black('gulp watch'), ['watch']);

/**  ===============
 *   = DEVELOPMENT =
 *   = =============
 *   Main 'catch-all' route to send users to frontend
 */
/* NOTE(thatkookooguy): has to be registered after API ROUTES */
// configure which files to watch and what tasks to use on file changes
gulp.task('watch', 'first, will compile SASS and run the server.\n' + indent +
    'Then, it watches changes and do the following things when needed:\n' + indent +
    colors.yellow('  1.') + ' compile SASS\n' + indent +
    colors.yellow('  2.') + ' restart server\n' + indent +
    colors.yellow('  3.') + ' reload browser', ['serve'],
    function() {
      function restart(file) {
        plugins.developServer.changed(function(error) {
          if (!error) {
            reloadBrowser('Backend file changed.', file.path);
          }
        });
      }

      function reloadBrowser(message, path) {
        gutil.log(message ? message : 'Something changed.', gutil.colors.bgBlue.white.bold('Reloading browser...'));
        plugins.livereload.changed(path);
      }

      gulp.watch(argv.lint ? FILES.LINT : [], ['lint-js']);
      gulp.watch(FILES.JS_ALL, ['jscpd', 'magicNumbers']);
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

gulp.task('start', ['styles'], function () {
  plugins.developServer.listen(options.server, function (error) {
    if (!error)
      bs.init(options.bs);
  });

  gulp.watch(FILES.FRONTEND_SASS, ['styles']);

  gulp.watch(FILES.FRONTEND_JS).on('change', bs.reload);

  gulp.watch(FILES.FRONTEND_HTML).on('change', bs.reload);
});

gulp.task('serve', 'start the Kibibit Code Editor server', ['styles'], function() {
  plugins.developServer.listen(options.server, plugins.livereload.listen);
});

gulp.task('debug', 'debug the project using ​' + colors.blue('~= node-inspector =~'), ['styles'], plugins.shell.task(['node-debug server.js']));

/**  ===============
 *   = BUILD TASKS =
 *   = =============
 *   Main 'catch-all' route to send users to frontend
 */
/* NOTE(thatkookooguy): has to be registered after API ROUTES */
gulp.task('dist', ['buildDist'], function() {
  return gulp.src('public/dist/**/kibibit.js', { base: '.'})
    //.pipe(plugins.uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('check', function() {
  return gulp.src('public/dist/assets/lib/**/*.css', { base: './public/dist' })
  .pipe(plugins.replace(/(['"]).*?\/font[s]?\//g, '$1'))
  .pipe(gulp.dest('test'));
});

gulp.task('buildDist', ['copyAssets', 'copyFonts', 'copyImages', 'templateCache'], function () {
    var sources = gulp.src(['./public/dist/app/templates.js'], {read: false});
    return gulp.src('./public/index.html')
        .pipe(plugins.replace(/src="(.*?\.js)"/g, replaceWithMin))
        .pipe(plugins.inject(sources, {
          transform: function (filepath) {
              return '<script type="text/javascript" src="' + filepath.replace('/public/', '') + '"></script>';
          }
        }))
        .pipe(plugins.useref({
          searchPath: './public/'
        }))
        //.pipe(gulpif('*.js', uglify()))
        .pipe(plugins.if('*.css', plugins.csso({ usage: true })))
        //.pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(gulp.dest('public/dist'));
});

gulp.task('copyFonts', function() {
  return gulp.src(['public/**/fonts/*', 'public/**/font/*'])
    .pipe(plugins.flatten())
    .pipe(gulp.dest('./public/dist/assets/fonts'));
});

gulp.task('copyImages', function() {
  return gulp.src('public/assets/images/*')
    .pipe(gulp.dest('./public/dist/assets/images'));
});

gulp.task('templateCache', function() {
  return gulp.src('public/app/**/*.html', { base: './public/app'})
    .pipe(plugins.angularTemplatecache('templates.js', {
      module: 'kibibitCodeEditor',
      transformUrl: function(url) {
        return url.replace(/^.*?\/public\//, '');
      }
    }))
    .pipe(gulp.dest('./public/dist/app'));
});

//temp
gulp.task('copyAssets', ['copyAce'], function() {
  return gulp.src(['public/assets/lib/**/*', '!public/assets/lib/bower_components', '!public/assets/lib/bower_components/**/*'], { base: './public/assets'})
    .pipe(gulp.dest('./public/dist/assets'));
});

gulp.task('copyAce', function() {
  return gulp.src('public/assets/lib/bower_components/ace-builds/**/*', { base: './public/assets'})
    .pipe(gulp.dest('./public/dist/assets'));
});

gulp.task('cleanDist', function () {
    return gulp.src('public/dist', {read: false})
        .pipe(plugins.clean());
});

gulp.task('styleguide', function() {
  return gulp.src(FILES.FRONTEND_SASS)
    .pipe(styleguide.generate({
        title: 'Kibibit Styleguide',
        server: true,
        rootPath: './public/assets/sass/',
        overviewPath: 'README.md',
        port: 3133
      }))
    .pipe(gulp.dest('./public/assets/sass/'));
});

gulp.task('styles', 'compile SASS to CSS'/*, ['styleguide']*/, function() {
  return gulp.src(FILES.MAIN_SASS)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      //.pipe(styleguide.applyStyles())
      //.pipe(csso({ usage: true }))
      .pipe(plugins.sourcemaps.write())
      //.pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./public/assets/css/'));
});

/** =================
 *   = CODE QUALITY =
 *   = ==============
 *   Main 'catch-all' route to send users to frontend
 */
/* NOTE(thatkookooguy): has to be registered after API ROUTES */
gulp.task('analyzeCode', 'run all sort of checks on styleguides and complexity', ['jscpd', 'magicNumbers'], function() {});

gulp.task('jscpd', 'finds out duplicate part of codes inside your project', function() {
  return gulp.src([].concat(FILES.LINT, FILES.FRONTEND_SASS))
    .pipe(plugins.jscpd({
      'min-lines': 10,
      verbose    : true
    }));
});

gulp.task('magicNumbers', 'shows you if you have any magic numbers (numbers that are used inline in javascript)', function () {
  return gulp.src(FILES.JS_ALL)
    .pipe(plugins.buddy({
      reporter: 'detailed'
    }));
});

gulp.task('lint', 'lint ' + colors.blue('all javascript and sass') + ' files', ['lint-js', 'lint-sass']);

gulp.task('lint-js', 'lint ' + colors.blue('all JS') + ' files in the following paths:\n' + indent +
  colors.yellow(FILES.JS_ALL.join(',\n' + indent)),
function() {
  return gulp.src(FILES.JS_ALL, { base: '.'})
      .pipe(plugins.cached('linting'))
      .pipe(plugins.eslint({
        fix: argv.format ? true : false
      }))
      .pipe(plugins.eslint.format())
      // if fixed, write the file to dest
      .pipe(plugins.if(isFixed, gulp.dest('.')))
      .pipe(plugins.eslint.failAfterError());
}, {
  options: {
    'format': 'fix lint problems that can be fixed automatically'
  }
});

gulp.task('lint-sass', 'lint ' + colors.blue('all SASS') + ' files in the following paths:\n' + indent +
    colors.yellow(FILES.FRONTEND_SASS.join(',\n' + indent)),
    function() {
      return gulp.src(FILES.FRONTEND_SASS)
          .pipe(plugins.cached('linting'))
          .pipe(plugins.sassLint())
          .pipe(plugins.sassLint.format())
          .pipe(plugins.sassLint.failOnError());
    });

gulp.task('depcheck',
  'checks for unused dependencies ' + colors.blue('(including devs)'),
  plugins.depcheck({
    ignoreDirs: ['test', 'logs', 'node_modules', 'lib'],
    ignoreMatches: ['karma-*', 'jscs-*', 'jasmine-*']
  })
);

gulp.task('format', 'formats ' + colors.blue('all') + ' the project\'s javascript files', ['format-server', 'format-front-end']);

gulp.task('format-front-end', 'formats the FE files in the following paths:\n' + indent +
    colors.yellow(FILES.FRONTEND_JS.join(',\n' + indent)),
    function() {
      return gulp.src([].concat(FILES.FRONTEND_JS), {
        base: 'public'
      })
      .pipe(plugins.cached('formating'))
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
      .pipe(plugins.cached('formating'))
            .pipe(jscs({
              fix: true
            }))
            .pipe(jscs.reporter())
            .pipe(gulp.dest('.'));
    });

gulp.task('sizes', function() {
  return gulp.src('./public/app/**/*.js')
    //all your gulp tasks
    // .pipe(gulp.dest('./dist/')
    .pipe(plugins.filesize({
      showFiles: false
    })) // [gulp] Size example.css: 265.32 kB  
});

gulp.task('test', 'run all tests using karma locally, and travis-ci on GitHub',
  function(done) {
    console.log('isTravis', isTravis);
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: isTravis
    }, done);
  }
);

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

function replaceWithMin(entireMatch, replaceText) {
  if (replaceText.endsWith('min.js') || entireMatch.indexOf('bower_components') === -1) {
    return entireMatch;
  }
  //console.log('seeing ' + replaceText);
  //console.log('looking for ' + __dirname + '/public/' + replaceText.replace('.js', '.min.js'))
  var minVersion = replaceText.replace('.js', '.min.js');
  if ( fs.existsSync(__dirname + '/public/' + minVersion) ) {
    //console.log('Found something EASILY!');
    return 'src="' + replaceText.replace('.js', '.min.js') + '"';
  } else {
    var folder = /^(.*\/bower_components\/.*?\/)/.exec(replaceText);
    folder = folder ? folder[0]: undefined;
    var filename = minVersion.replace(/^.*\//, '');
    //console.log('looking for ' + filename);
    var results = search.recursiveSearchSync(filename, __dirname + '/public/' + folder);
    if (results.length > 0) {
      //console.log('Found something THE HARD WAY! ' + results[0]);
      return 'src="' + results[0].replace(__dirname + '/public/', '') + '"';
    } else {
      var results2 = search.recursiveSearchSync(filename.replace('.min', ''), __dirname + '/public/' + folder);
      for (var i = 0; i < results2.length; i++) {
        if (results2[i] && (results2[i].indexOf('minified') !== -1 || results2[i].indexOf('-min-') !== -1)) {
          return 'src="' + results2[i].replace(__dirname + '/public/', '') + '"';
        }
      }
    }
  }
  //console.log('found nothing :-(');
  return entireMatch;
}