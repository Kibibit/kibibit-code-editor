module.exports = function(app, express) {

  var fileService = require('../models/fileService.js'),
      folderService = require('../models/folderService.js'),
      userHomeDirectoryService =
        require('../models/userHomeDirectoryService.js'),
      downloadService = require('../models/downloadService.js');

  var apiRouter = express.Router();

  apiRouter.get('/', function(req, res) {
    res.json({
      message: 'hooray! welcome to our api!'
    });
  });

  apiRouter.route('/file/:file_id')
      // get the file content with that file_id = full file path
      .get(fileService.get)
      // update the file content with this id
      .put(fileService.put)
      // delete the file content with this id
      .delete(fileService.delete);

  apiRouter.route('/file/:file_id/:extra_arg')
      // delete the file content with this id
      .put(fileService.putExtraArg);

  apiRouter.route('/directory/:dir_id')
      // get the directory content with that directory_id = full file path
      .get(folderService.get)
      // create a new directory with the dir_id
      .put(folderService.put)
      // delete the directory content with this id
      .delete(folderService.delete);

  apiRouter.route('/directory/:dir_id/:extra_arg')
      // ----------------------------------------------------
      // rename directory
      .put(folderService.putExtraArg)
      // hard delete the directory content with this id. This means all the files inside are deleted recursively
      .delete(folderService.deleteExtraArg);

  apiRouter.route('/download/:file_id')
      .get(downloadService.get);

  apiRouter.route('/userHomeDirectory/')
      .get(userHomeDirectoryService.get);

  return apiRouter;
};
