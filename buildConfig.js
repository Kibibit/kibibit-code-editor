var config = require('./config');

var buildConfig = {
  flags: {
    watch: false
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
      port: config.port + 1,
      ui: {
        port: config.port + 2
      },
      proxy: {
        target: 'http://localhost:' + config.port,
        middleware: function (req, res, next) {
          //console.log(req.url);
          next();
        }
      },
      files: ['./public/**/*.css'], // files to watch with bs instantly (.ejs & .css)
      logLevel: 'silent',
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
      }
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
