var fs = require('fs'),
    userHomeDirectory = require('user-home'),
    STATUS_CODES = require('http-status-codes');
var console = require('./consoleService')
  ('SETTINGS SERVICE', ['rainbow', 'inverse']);

var settingsService = {};

var settingsLocation = userHomeDirectory + '/.kibibit.json';

settingsService.get = function(req, res) {
  try {
    var savedSettings =
      JSON.parse(fs.readFileSync(userHomeDirectory + '/.kibibit.json', 'utf8'));

    res.json(savedSettings);
    console.info('settings sent: ' + settingsLocation);

  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Kibibit couldn\'t read the local settings file'
    });
    console.error('local settings returned an error: ' + err);

  }
};

settingsService.put = function(req, res) {
  if (req.body.newContent) {
    fs.writeFile(settingsLocation,
      JSON.stringify(req.body.newContent, null, 2),
      'utf8',
      function(err) {
        if (err) {
          res.json(err);
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
            message: 'Kibibit wasn\'t able to save settings localy'
          });
          console.error('settings couldn\'t be saved: ' + err);
        } else {
          res.json({
            message: 'settings saved successfully'
          });
          console.info('settings saved: ' + settingsLocation);
        }
      }
    );
  } else {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Kibibit expects a newContent variable in the request body'
    });
  }
};

module.exports = settingsService;
