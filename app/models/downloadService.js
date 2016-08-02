var console = require('./consoleService')('DOWNLOAD', ['inverse']);

var downloadService = {};

downloadService.get = function(req, res) {
  try {
    var fileFullPath = req.params.file_id;
    res.download(fileFullPath);
  } catch (err) {
    console.error('Couldn\'t send file to client', err);
	res.json({
		errno: 5,
		message: 'something went wroooong!'
	});
  }
};

module.exports = downloadService;
