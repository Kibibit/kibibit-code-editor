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
  gulp.src(FRONTEND_SASS)
    .pipe(replace(/\$primary: (.*?);/, '$primary: ' + mainColor + ';'))
    .pipe(concat('style.' + themeName + '.css'))
    .pipe(sass())
    .pipe(gulp.dest('./public/assets/css/'));
  res.json({
    themeName: themeName
  });
};

module.exports = colorThemeService;
