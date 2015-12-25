// grab our packages
var gulp   = require('gulp'),
beautify = require('gulp-jsbeautifier'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
minifyCSS = require('gulp-minify-css'),
rename = require('gulp-rename'),
prettify = require('gulp-jsbeautifier'),
jshint = require('gulp-jshint'),
concat = require('gulp-concat'),
livereload = require('gulp-livereload'),
server = require('gulp-develop-server'),
shell = require('gulp-shell')
gutil = require('gulp-util');

var options = {
	path: './server.js'
};
var FILES = {};
FILES.FRONTEND_JS = ['./public/app/**/*.js'];
FILES.FRONTEND_HTML = ['./public/app/**/*.html'];
FILES.FRONTEND_SASS = ['./public/assets/sass/**/*.scss'];
FILES.FRONTEND_ALL = [].concat(FILES.FRONTEND_JS, FILES.FRONTEND_HTML, FILES.FRONTEND_SASS);
FILES.SERVER_JS = ['./app/**/*.js', './server.js', './config.js'];
FILES.BUILD_FILES = ['./gulpfile.js'];
FILES.JS_ALL = [].concat(FILES.FRONTEND_JS, FILES.SERVER_JS);

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('lint-js', function() {
	return gulp.src(FILES.JS_ALL)
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-sass', function() {
	return gulp.src(FILES.FRONTEND_SASS)
	.pipe(sass().on('error', sass.logError));
});

gulp.task('lint', ['lint-js', 'lint-sass']);

gulp.task('format-front-end', function() {
	return gulp.src([].concat(FILES.FRONTEND_JS, FILES.FRONTEND_HTML), {
             base: 'public'
        })
	.pipe(prettify({
	    //config: "./.jsbeautifyrc",
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
	.pipe(gulp.dest('./public')); // add this to a different folder in order to test first
});

gulp.task('format-server', function() {
	return gulp.src([].concat(FILES.SERVER_JS, FILES.BUILD_FILES), {
             base: '.'
        })
	.pipe(prettify({
	    js: {
	        braceStyle: "collapse",
	        breakChainedMethods: false,
	        e4x: false,
	        evalCode: false,
	        indentChar: " ",
	        indentLevel: 0,
	        // indentSize: 4,
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
	.pipe(gulp.dest('.'));
});

gulp.task('format', ['format-server', 'format-front-end']);

gulp.task('styles', function() {
	return gulp.src(FILES.FRONTEND_SASS)
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(concat('style.css'))
	//.pipe(minifyCSS())
	.pipe(sourcemaps.write())
	//.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('./public/assets/css/'));
});

gulp.task( 'serve', function() {
    server.listen(options, livereload.listen);
});

gulp.task('debug', shell.task(['node-debug server.js']));

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', [ 'serve' ], function() {
	function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) {
            	reloadBrowser('Backend file changed.', file.path);
            }
        });
    }

    function reloadBrowser( message, path ) {
    	gutil.log(message ? message : 'Something changed.', gutil.colors.bgBlue.white.bold('Reloading browser...'));
    	livereload.changed( path );
    }

	gulp.watch(FILES.JS_ALL, ['lint-js']);
	gulp.watch(FILES.FRONTEND_SASS, ['styles']);
	gulp.watch(FILES.SERVER_JS).on( 'change', restart );
	gulp.watch(FILES.FRONTEND_ALL).on( 'change', function(file) {reloadBrowser('Frontend file changed.', file.path);} );
});
