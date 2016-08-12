// Karma configuration
// Generated on Sat Jan 02 2016 18:50:53 GMT+0200 (IST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    'public/assets/lib/bower_components/jquery/dist/jquery.min.js',
    'public/assets/lib/bower_components/angular/angular.js',
    'public/assets/lib/bower_components/clipboard/dist/clipboard.js',
    'public/assets/lib/bower_components/re-tree/re-tree.js',
    'public/assets/lib/bower_components/ng-device-detector/ng-device-detector.js',
    'public/assets/lib/bower_components/angular-sanitize/angular-sanitize.js',
    'public/assets/lib/bower_components/angular-route/angular-route.js',
    'public/assets/lib/bower_components/angular-animate/angular-animate.js',
    'public/assets/lib/bower_components/angular-aria/angular-aria.js',
    'public/assets/lib/bower_components/angular-material/angular-material.js',
    'public/assets/lib/bower_components/ng-dialog/js/ngDialog.js',
    'public/assets/lib/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
    'public/assets/lib/bower_components/ng-scrollbars/dist/scrollbars.min.js',
    'public/assets/lib/bower_components/angular-fullscreen/src/angular-fullscreen.js',
    'public/assets/lib/bower_components/angular-loading-bar/build/loading-bar.min.js',
    'public/assets/lib/angular-tree-control.js',
    'https://cdn.rawgit.com/ajaxorg/ace-builds/master/src-noconflict/ace.js',
    'https://cdn.rawgit.com/ajaxorg/ace-builds/master/src-noconflict/ext-modelist.js',
    'https://cdn.rawgit.com/ajaxorg/ace-builds/master/src-noconflict/ext-themelist.js',
    'public/app/**/*.js',
    'test/hello.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'public/app/**/*.js': ['coverage']
    },

    coverageReporter: {
        reporters: [{
            type : 'html',
            dir : 'coverage/'
        }, {
            type: 'text-summary'
        }]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
