var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});

var argv = require('yargs').argv;
var buildConfig = require('../buildConfig');

var isTravis = process.env.TRAVIS || false;
var mainPath = __dirname.replace('/gulp-tasks', '');

module.exports = function() {
  gulp.task('styles', 'compile SASS to CSS', function() {
    return gulp.src(buildConfig.FILES.MAIN_SASS)
      .pipe(plugins.plumber(buildConfig.options.plumber))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      .pipe(plugins.sourcemaps.write())
      //.pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./public/assets/css/'));
  });

};
