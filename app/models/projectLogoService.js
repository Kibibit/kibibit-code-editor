var fs = require('fs');
var console = require('./consoleService')('PROJECT LOGO', ['blue', 'inverse']);

var projectLogoService = {};

projectLogoService.get = function(req, res) {
  var fileFullPath = req.params.file_id;
  fileFullPath += '/logo.png';
  try {
    var stat = fs.statSync(fileFullPath);
    res.json({
      logoPath: fileFullPath
    });
  } catch (error) {
    res.json({
      content: 'no logo',
      errno: 100
    });
    console.error(error);
  }
};

module.exports = projectLogoService;
