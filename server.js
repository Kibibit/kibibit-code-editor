var app = require('./app');
var ngrok = require('ngrok');
var config = require('./config');
var logo = require('./printLogo');
var colors = require('colors');
var console = require('./app/models/consoleService')('SERVER',
  ['magenta', 'inverse']);

var token = '';

/** ==========
 *   = SERVER =
 *   = ========
 */
app.listen(config.port, function() {
  logo();
  console.info('Server listening at port ' +
    colors.bgBlue.white.bold(' ' + config.port + ' '));
});

if (token) {
  ngrok.authtoken(token, function(err) {
    if (err) {
      console.error(err);
    }
  });
  ngrok.connect(config.port, function (err, url) {
    if (err) {
      console.error(err);
    } else {
      console.info(colors.cyan('ngrok') +
        ' - serving your site from ' +
        colors.yellow(url));
    }
  });
}
