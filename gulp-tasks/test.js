var gulp = require('gulp');
var karma = require('karma').server;
var isTravis = process.env.TRAVIS || false;
var mainPath = __dirname.replace('/gulp-tasks', '');

module.exports = function () {
  gulp.task('test', 'run all tests using karma locally, and travis-ci on GitHub', function(done) {
    // console.log('isTravis', isTravis);
    karma.start({
      configFile: mainPath + '/karma.conf.js',
      singleRun: isTravis
    }, done);
  });
};