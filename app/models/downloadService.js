var STATUS_CODES = require('http-status-codes');
var console = require('./consoleService')('DOWNLOAD', ['inverse']);

var downloadService = {};

downloadService.get = function(req, res) {
  try {
    var fileFullPath = req.params.file_id;
    res.download(fileFullPath);
  } catch (err) {
    console.error('Couldn\'t send file to client', err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'something went wroooong!'
    });
  }
};

module.exports = downloadService;
