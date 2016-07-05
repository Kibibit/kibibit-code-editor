var fs = require('fs'),
    userHomeDirectory = require('user-home');
var console = require('./consoleService')
  ('SETTINGS SERVICE', ['rainbow', 'inverse']);

var settingsService = {};

var settingsLocation = userHomeDirectory + '/.kibibit.json';

settingsService.get = function(req, res) {
  fs.readFile(settingsLocation, 'utf8', function(err, data) {
    if (err) {
      res.json(err);
      console.error('local settings returned an error: ' + err);
    } else {
      fs.stat(settingsLocation, function(err, stats) {
        var file = {
          settings: data
        };
        res.json(file);
        console.info('settings sent: ' + settingsLocation);
      });
    }
  });
};

settingsService.put = function(req, res) {
  if (req.body.newContent) {
    fs.writeFile(settingsLocation,
      JSON.stringify(req.body.newContent, null, 2),
      'utf8',
      function(err) {
        if (err) {
          res.json(err);
          console.error('settings couldn\'t be saved: ' + err);
        } else {
          res.json({
            message: 'settings saved successfully'
          });
          console.info('settings saved: ' + settingsLocation);
        }
      }
    );
  }
};

module.exports = settingsService;
