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

gulp.task('format-front-end', function() {
	return gulp.src([
		/* Ignore folders which are from external libraries that might contain html, javascript, or css/sass*/
		'!./public/assets/lib/', // exclude libraries folder
		'!./public/assets/lib/**', // exclude anything in the libraries folder
		/* JavaScript */
		'./public/**/*.js', // front-end javascript
		/* HTML */
		'./public/**/*.html', // front-end javascript
		/* SASS */
		'./public/assets/sass/**/*.scss',
	])
	.pipe(prettify({
	    //config: "path/to/.jsbeautifyrc",
	    html: {
	        braceStyle: "collapse",
	        indentChar: " ",
	        indentScripts: "keep",
	        indentSize: 4,
	        maxPreserveNewlines: 10,
	        preserveNewlines: true,
	        /* unformatted: ["a", "sub", "sup", "b", "i", "u"], */
	        wrapLineLength: 0
	    },
	    css: {
	        indentChar: " ",
	        indentSize: 4
	    },
	    js: {
	        braceStyle: "collapse",
	        breakChainedMethods: false,
	        e4x: false,
	        evalCode: false,
	        indentChar: " ",
	        indentLevel: 0,
	        indentSize: 4,
	        indentWithTabs: false,
	        jslintHappy: false,
	        keepArrayIndentation: false,
	        keepFunctionIndentation: false,
	        maxPreserveNewlines: 10,
	        preserveNewlines: true,
	        spaceBeforeConditional: true,
	        spaceInParen: false,
	        unescapeStrings: false,
	        wrapLineLength: 0
	    }
	}))
	.pipe(gulp.dest('./dist')); // add this to a different folder in order to test first
});

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
