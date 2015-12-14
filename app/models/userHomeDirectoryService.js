var console = process.console,
    userHomeDirectory = require('user-home');

var userHomeDirectoryService = {};

userHomeDirectoryService.get = function(req, res) {
    res.json(userHomeDirectory);
    console.time().tag('DIRECTORY CONTENT').info('user home directory sent : ' + userHomeDirectory);
};

module.exports = userHomeDirectoryService;
