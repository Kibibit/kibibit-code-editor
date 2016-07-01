var console = require('./consoleService')('DOWNLOAD', ['inverse']);

var downloadService = {};

downloadService.get = function(req, res) {
  try {
    var fileFullPath = req.params.file_id;
    res.download(fileFullPath);
  } catch(err) {
    console.error('Couldn\'t send file to client');
  }
};

module.exports = downloadService;
