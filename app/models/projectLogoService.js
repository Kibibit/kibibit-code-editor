var fs = require('fs');
var console = require('./consoleService')('PROJECT LOGO', ['blue', 'inverse']);

var projectLogoService = {};

var FRONTEND_SASS = ['./public/assets/sass/**/*.scss'];

projectLogoService.get = function(req, res) {
  var fileFullPath = req.params.file_id;
  fileFullPath += '/.logo.png';
  try {
  	var stat = fs.statSync(fileFullPath);
  	res.sendFile(fileFullPath, {dotfiles: 'allow'});
  } catch (error) {
  	res.json({
      content: 'no logo',
      errno: -1
    });
  	console.error(error);
  }
};

module.exports = projectLogoService;
