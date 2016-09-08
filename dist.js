var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

var buildConfig = require('../buildConfig');
var colors = require('colors');
var fs = require('fs');
var search = require('recursive-search');
var mainPath = __dirname.replace('/gulp-tasks', '');

module.exports = function() {
  gulp.task('dist', 'Create a distribution Folder for our Front-End', [
    'dist:clean',
    'dist:copy',
    'dist:templateCache',
    'dist:parseHtml',
    'dist:afterBuild'
  ], function() {
    return gulp.src('./public/dist/index.html', { base: '.' })
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.htmlmin({
          collapseWhitespace: true,
          removeComments: true
        }))
        .pipe(gulp.dest('.'));
  });

  // CLEAN

  gulp.task('dist:clean', function () {
    return gulp.src('public/dist', {read: false})
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.clean());
  });

  // COPY

  gulp.task('dist:copy', [
    'dist:copy:ace',
    'dist:copy:assets',
    'dist:copy:fonts',
    'dist:copy:images'
  ]);

  gulp.task('dist:copy:ace', [ 'dist:clean' ], function() {
    return gulp.src('public/assets/lib/bower_components/ace-builds/**/*',
      { base: './public/assets'})
      .pipe(gulp.dest('./public/dist/assets'));
  });

  gulp.task('dist:copy:assets', [ 'dist:clean' ], function() {
    return gulp.src([
      'public/assets/lib/**/*',
      '!public/assets/lib/bower_components',
      '!public/assets/lib/bower_components/**/*'],
      { base: './public/assets'})
      .pipe(gulp.dest('./public/dist/assets'));
  });

  gulp.task('dist:copy:fonts', [ 'dist:clean' ], function() {
    return gulp.src([
      'public/**/fonts/*',
      'public/**/font/*',
      '!**/*.{css,scss,less,sass,json}'])
      .pipe(plugins.flatten())
      .pipe(gulp.dest('./public/dist/assets/fonts'));
  });

  gulp.task('dist:copy:images', [ 'dist:clean' ], function() {
    return gulp.src('public/assets/images/*')
      .pipe(gulp.dest('./public/dist/assets/images'));
  });

  // TEMPLATE CACHE

  gulp.task('dist:templateCache', [ 'dist:clean' ], function() {
    return gulp.src('public/app/**/*.html', { base: './public/app'})
      .pipe(plugins.plumber(buildConfig.options.plumber))
      .pipe(plugins.angularTemplatecache('templates.js', {
        module: 'kibibitCodeEditor',
        transformUrl: function(url) {
          return url.replace(/^.*?\/public\//, '');
        }
      }))
      .pipe(gulp.dest('./public/dist/app'));
  });

  // CHANGE HTML

  gulp.task('dist:parseHtml',
    ['styles', 'dist:copy', 'dist:templateCache', 'dist:clean'],
    function () {
      var sources = gulp.src([ './public/dist/app/templates.js' ],
        { read: false });
      return gulp.src('./public/index.html')
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.replace(/src="(.*?\.js)"/g, replaceWithMin))
        .pipe(plugins.inject(sources, {
          transform: function (filepath) {
            return '<script type="text/javascript" src="'
              + filepath.replace('/public/', '') + '"></script>';
          }
        }))
        .pipe(plugins.useref({
          searchPath: './public/'
        }))
        .pipe(plugins.if('*.css', plugins.csso({ usage: true })))
        //.pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(gulp.dest('public/dist'));
    }
  );

  // AFTER MATH

  gulp.task('dist:afterBuild', [
    'dist:afterBuild:replaceRelativePathsForFonts',
    'dist:afterBuild:uglify'
  ]);

  gulp.task('dist:afterBuild:replaceRelativePathsForFonts',
    ['dist:parseHtml', 'dist:clean'],
    function() {
      return gulp.src('public/dist/assets/fonts/fonts.css')
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.replace(/(['"]).*?\/font[s]?\//g, '$1'))
        .pipe(gulp.dest('.'));
    }
  );

  gulp.task('dist:afterBuild:uglify',
    ['dist:parseHtml', 'dist:clean'],
    function() {
      return gulp.src('public/dist/**/kibibit.js', { base: '.'})
        .pipe(plugins.plumber(buildConfig.options.plumber))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('.'));
    }
  );

  ////////

  function replaceWithMin(entireMatch, pathToFile) {
    if (pathToFile.endsWith('min.js')
      || entireMatch.indexOf('bower_components') === -1) {
      return entireMatch;
    }

    var pathPrefix = mainPath + '/public/';
    var minVersion = pathToFile.replace('.js', '.min.js');
    var minifiedSameFolder = minifiedVersionInSameFolder(pathToFile);

    if (minifiedSameFolder) {
      // LOOK FOR MINIFIED VERSION IN SAME FOLDER as <name>.min.js
      return buildSrcString(minifiedSameFolder);
    } else {
       // LOOK FOR MINIFIED VERSION IN SAME PLUGIN FOLDER as <name>.min.js
      var minifiedVersionFilename = minVersion.replace(/^.*\//, '');
      var folder = getBowerComponentMainPluginFolder(pathToFile);

      var searchMinifiedVersionResults =
        search.recursiveSearchSync(
          minifiedVersionFilename,
          pathPrefix + folder);

      if (searchMinifiedVersionResults.length > 0) {
        return buildSrcString(
          searchMinifiedVersionResults[0].replace(pathPrefix, ''));
      } else {
        // LOOK FOR MINIFIED VERSION AS SAME NAME IN MIN FOLDER as <name>.js
        var results2 = search.recursiveSearchSync(
          minifiedVersionFilename.replace('.min', ''), pathPrefix + folder);
        for (var i = 0; i < results2.length; i++) {
          if (results2[i]
            && (results2[i].indexOf('minified') !== -1
              || results2[i].indexOf('-min-') !== -1)) {
            return buildSrcString(results2[i].replace(pathPrefix, ''));
          }
        }
      }
    }
    // DON'T REPLACE AT ALL
    return entireMatch;
  }

  function minifiedVersionInSameFolder(pathToFile) {
    var pathPrefix = mainPath + '/public/';
    var minVersion = pathToFile.replace('.js', '.min.js');

    return fs.existsSync(pathPrefix + minVersion) ? minVersion : undefined;
  }

  function getBowerComponentMainPluginFolder(pathToFile) {
    var folder = /^(.*\/bower_components\/.*?\/)/.exec(pathToFile);
    folder = folder ? folder[0] : undefined;

    return folder;
  }

  function buildSrcString(pathToFile) {
    return 'src="' + pathToFile + '"';
  }

};
