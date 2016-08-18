module.exports = function(app, express) {

  var fileService = require('../models/fileService.js'),
      folderService = require('../models/folderService.js'),
      userHomeDirectoryService =
        require('../models/userHomeDirectoryService.js'),
      downloadService = require('../models/downloadService.js'),
      quotesService = require('../models/quotesService.js'),
      settingsService = require('../models/settingsService.js'),
      jwt = require('jsonwebtoken');

  var config = {
    TOKEN_SECRET: 'kibibitIsAwesome'
  };

  var apiRouter = express.Router();

  // route middleware to verify a token
  apiRouter.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config.TOKEN_SECRET, function(err, decoded) {
        if (err) {
          console.info('failed to authenticate', err);
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
            });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          console.info('user authenticated successfully');
          next();
        }
      });
    } else {
      // if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      console.info('No token provided');
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
        });
    }
    // next() used to be here
  });

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

  apiRouter.route('/settings/')
      .get(settingsService.get)
      .put(settingsService.put);

  apiRouter.route('/quotes/:num?')
    .get(quotesService.get);

  return apiRouter;
};
