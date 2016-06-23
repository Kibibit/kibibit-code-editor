var userHomeDirectory = require('user-home');

var console = require('./consoleService')
  ('USER DIRECTORY', ['yellow', 'inverse']);
var userHomeDirectoryService = {};

userHomeDirectoryService.get = function(req, res) {
  res.json(userHomeDirectory);
  console.info('user home directory sent : ' + userHomeDirectory);
};

module.exports = userHomeDirectoryService;
