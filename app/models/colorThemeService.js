var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace');
var console = require('./consoleService')('COLOR THEME', ['blue', 'inverse']);

var colorThemeService = {};

var FRONTEND_SASS = ['./public/assets/sass/**/*.scss'];

colorThemeService.put = function(req, res) {
  var mainColor = req.params.color_hex;
  var themeName = req.params.project_name;
  var cssPath = __dirname.replace('/app/models', '/public/assets/css');
  gulp.src(['./public/assets/sass/_colors.scss'])
  .pipe(replace(/\$primary: (.*?);/, '$primary: ' + mainColor + ';'))
  .pipe(gulp.dest('./public/assets/sass/'));

  gulp.src(FRONTEND_SASS)
    .pipe(concat('style.' + themeName + '.css'))
    .pipe(sass())
    .pipe(gulp.dest('./public/assets/css/'));

  setTimeout(function() {
    res.json({
      themeName: themeName
    });
  }, 1000);
};

module.exports = colorThemeService;
