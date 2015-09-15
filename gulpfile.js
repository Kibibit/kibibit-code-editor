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
gulp.task('lint-js', function() {
	return gulp.src(['./**/*.js', '!./node_modules/', '!./node_modules/**', '!./logs/'])
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-sass', function() {
	return gulp.src('./public/assets/sass/**/*.scss')
	.pipe(sass().on('error', sass.logError));
});

gulp.task('lint', ['lint-js', 'lint-sass']);

gulp.task('styles', function() {
	return gulp.src('./public/assets/sass/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	//.pipe(minifyCSS())
	.pipe(sourcemaps.write())
	//.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./public/assets/css/'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
	gulp.watch(['./**/*.js', '!./node_modules/', '!./node_modules/**', '!./logs/'], ['lint-js']);
	gulp.watch('./public/assets/sass/**/*.scss', ['styles']);
});