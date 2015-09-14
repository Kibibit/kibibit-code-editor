// grab our packages
var gulp   = require('gulp'),
beautify = require('gulp-jsbeautifier'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
minifyCSS = require('gulp-minify-css'),
rename = require('gulp-rename'),
jshint = require('gulp-jshint');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
	return gulp.src('./javascript/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('styles', function() {
	gulp.src('./public/assets/sass/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(minifyCSS())
	.pipe(sourcemaps.write())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./public/assets/css/'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
	gulp.watch('./javascript/*.js', ['jshint']);
	gulp.watch('./public/assets/sass/**/*.scss', ['styles']);
});