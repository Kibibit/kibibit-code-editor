var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-buddy.js': 'buddy'
  }
});
var buildConfig = require('../buildConfig');
var styleguide = require('sc5-styleguide');
var outputPath = 'public/assets/styleguide';
var config = require('../config');

module.exports = function() {

  gulp.task('doc', function (cb) {
    gulp.src(['README.md', './public/**/*.js'], {read: false})
      .pipe(plugins.jsdoc3(cb));
  });

  gulp.task('styleguide:generate', function() {
    plugins.util.log(
      plugins.util.colors.bold('style-guide: '),
      plugins.util.colors.magenta('http://localhost:' +
        buildConfig.options.styleguide.port));
    return gulp.src(buildConfig.FILES.FRONTEND_SASS)
      .pipe(styleguide.generate({
        title: 'Kibibit Styleguide',
        server: true,
        rootPath: outputPath,
        overviewPath: 'README.md',
        port: buildConfig.options.styleguide.port,
        disableEncapsulation: true,
        extraHead: [
          '<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.2/angular-material.min.css">',
          '<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/icon?family=Material+Icons">',
          '<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js">'
        ],
        "filesConfig": [
          {
            "name": "kibibitCodeEditor",
            "files": [
              //"http://localhost:" + config.port + "/assets/lib/bower_components/angular-material/angular-material.min.js",
              "http://localhost:" + config.port + "/assets/kibibit.styleguide.js",
              "http://localhost:" + config.port + "/app/components/searchProject/searchProject.js"
            ]
          }
        ]
      }))
      .pipe(gulp.dest(outputPath));
  });

  gulp.task('styleguide:applyStyles', function() {
    return gulp.src(buildConfig.FILES.MAIN_SASS)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass())
      .pipe(styleguide.applyStyles())
      .pipe(plugins.sourcemaps.write())
      //.pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(outputPath));
  });

  gulp.task('styleguide', ['styleguide:generate', 'styleguide:applyStyles']);

};
