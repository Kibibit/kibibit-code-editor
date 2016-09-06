var buildConfig = {
  flags: {
    watch: false,
    build: false
  },
  options: {
    server: {
      path: './server.js'//,
      //execArgv: ['--harmony']
    },
    distServer: {
      path: './server.js',
      args: ['--dist']
    },
    bs: {
      proxy: {
        target: 'http://localhost:3141',
        middleware: function (req, res, next) {
          //console.log(req.url);
          next();
        }
      },
      files: ['./public/**/*.css'], // files to watch with bs instantly (.ejs & .css)
      logLevel: 'silent'
    }
  },
  indent: '                        ',
  FILES: {}
};
buildConfig.FILES.FRONTEND_JS = ['./public/app/**/*.js'];
buildConfig.FILES.FRONTEND_HTML = ['./public/app/**/*.html'];
buildConfig.FILES.FRONTEND_SASS = ['./public/assets/sass/**/*.scss', '!**/_init.scss'];
buildConfig.FILES.MAIN_SASS = ['./public/assets/sass/style.scss'];
buildConfig.FILES.FRONTEND_ALL = [].concat(buildConfig.FILES.FRONTEND_JS, buildConfig.FILES.FRONTEND_HTML, buildConfig.FILES.FRONTEND_SASS);
buildConfig.FILES.SERVER_MAIN = ['./server.js'];
buildConfig.FILES.SERVER_JS_WITHOUT_MAIN = ['./app/**/*.js', './config.js'];
buildConfig.FILES.SERVER_JS = [].concat(buildConfig.FILES.SERVER_MAIN, buildConfig.FILES.SERVER_JS_WITHOUT_MAIN);
buildConfig.FILES.BUILD_FILES = ['./gulpfile.js'];
buildConfig.FILES.JS_ALL = [].concat(buildConfig.FILES.FRONTEND_JS, buildConfig.FILES.SERVER_JS);
buildConfig.FILES.LINT_JS = [].concat(buildConfig.FILES.FRONTEND_JS, buildConfig.FILES.SERVER_JS_WITHOUT_MAIN);

module.exports = buildConfig;
