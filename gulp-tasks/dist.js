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
  gulp.task('dist', 'Create a distribution Folder for our Front-End', ['dist:replaceRelativePathsForFonts'], function() {
    return gulp.src('public/dist/**/kibibit.js', { base: '.'})
      .pipe(plugins.uglify())
      .pipe(gulp.dest('.'));
  });

  gulp.task('dist:replaceRelativePathsForFonts', ['dist:parseHtml'], function() {
    return gulp.src('public/dist/assets/fonts/fonts.css')
    .pipe(plugins.replace(/(['"]).*?\/font[s]?\//g, '$1'))
    .pipe(gulp.dest('.'));
  });

  gulp.task('dist:parseHtml', ['dist:copy', 'dist:templateCache'], function () {
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
          .pipe(plugins.if('*.css', plugins.csso({ usage: true })))
          //.pipe(plugins.if('*.js', plugins.uglify()))
          .pipe(gulp.dest('public/dist'));
  });

  gulp.task('dist:copy', [
    'dist:copy:ace',
    'dist:copy:assets',
    'dist:copy:fonts',
    'dist:copy:images'
    ]);

  gulp.task('dist:copy:ace', function() {
    return gulp.src('public/assets/lib/bower_components/ace-builds/**/*', { base: './public/assets'})
      .pipe(gulp.dest('./public/dist/assets'));
  });

  gulp.task('dist:copy:assets', ['dist:copy:ace'], function() {
    return gulp.src(['public/assets/lib/**/*', '!public/assets/lib/bower_components', '!public/assets/lib/bower_components/**/*'], { base: './public/assets'})
      .pipe(gulp.dest('./public/dist/assets'));
  });

  gulp.task('dist:copy:fonts', function() {
    return gulp.src(['public/**/fonts/*', 'public/**/font/*', '!**/*.{css,scss,less,sass,json}'])
      .pipe(plugins.flatten())
      .pipe(gulp.dest('./public/dist/assets/fonts'));
  });

  gulp.task('dist:copy:images', function() {
    return gulp.src('public/assets/images/*')
      .pipe(gulp.dest('./public/dist/assets/images'));
  });

  gulp.task('dist:templateCache', function() {
    return gulp.src('public/app/**/*.html', { base: './public/app'})
      .pipe(plugins.angularTemplatecache('templates.js', {
        module: 'kibibitCodeEditor',
        transformUrl: function(url) {
          return url.replace(/^.*?\/public\//, '');
        }
      }))
      .pipe(gulp.dest('./public/dist/app'));
  });

  gulp.task('dist:uglify', function() {
    return gulp.src('public/dist/**/kibibit.js', { base: '.'})
      .pipe(plugins.uglify())
      .pipe(gulp.dest('.'));
  });

  gulp.task('cleanDist', function () {
      return gulp.src('public/dist', {read: false})
          .pipe(plugins.clean());
  });


  function replaceWithMin(entireMatch, pathToFile) {
    if (pathToFile.endsWith('min.js') || entireMatch.indexOf('bower_components') === -1) {
      return entireMatch;
    }
    
    var pathPrefix = mainPath + '/public/'
    var minVersion = pathToFile.replace('.js', '.min.js');
    var minifiedSameFolder = minifiedVersionInSameFolder(pathToFile);

    if (minifiedSameFolder) { // LOOK FOR MINIFIED VERSION IN SAME FOLDER as <name>.min.js
      return buildSrcString(minifiedSameFolder);
    } else { // LOOK FOR MINIFIED VERSION IN SAME PLUGIN FOLDER as <name>.min.js
      var minifiedVersionFilename = minVersion.replace(/^.*\//, '');
      var folder = getBowerComponentMainPluginFolder(pathToFile);

      var searchMinifiedVersionResults = search.recursiveSearchSync(minifiedVersionFilename, pathPrefix + folder);

      if (searchMinifiedVersionResults.length > 0) {
        return buildSrcString(searchMinifiedVersionResults[0].replace(pathPrefix, ''));
      } else { // LOOK FOR MINIFIED VERSION AS SAME NAME IN MIN FOLDER as <name>.js
        var results2 = search.recursiveSearchSync(minifiedVersionFilename.replace('.min', ''), pathPrefix + folder);
        for (var i = 0; i < results2.length; i++) {
          if (results2[i] && (results2[i].indexOf('minified') !== -1 || results2[i].indexOf('-min-') !== -1)) {
            return buildSrcString(results2[i].replace(pathPrefix, ''));
          }
        }
      }
    }
    // DON'T REPLACE AT ALL
    return entireMatch;
  }

  function minifiedVersionInSameFolder(pathToFile) {
    var pathPrefix = mainPath + '/public/'
    var minVersion = pathToFile.replace('.js', '.min.js');

    return fs.existsSync(pathPrefix + minVersion) ? minVersion : undefined;
  }

  function getBowerComponentMainPluginFolder(pathToFile) {
    var folder = /^(.*\/bower_components\/.*?\/)/.exec(pathToFile);
    folder = folder ? folder[0]: undefined;

    return folder;
  }

  function buildSrcString(pathToFile) {
    return 'src="' + pathToFile + '"';
  }

};
