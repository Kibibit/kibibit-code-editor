// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'); // call express
var compression = require('compression');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon'); // set favicon
var bodyParser = require('body-parser');
var colors = require('colors');
var argv = require('yargs').argv;
var app = express(); // define our app using express
var scribe = require('scribe-js')(); // used for logs
var console = require('./app/models/consoleService')('APP',
  ['magenta', 'inverse']);

var publicFolder = __dirname + (argv.dist ? '/public/dist' : '/public');

if (argv.dist) {
  console.info('!!PRODUCTION!!');
}

// hook helmet to our express app. This adds some protection
// to each communication with the server
// read more at https://github.com/helmetjs/helmet
app.use(helmet());

// compress all requests
app.use(compression({
  threshold: 0
}));

colors.enabled = true; //enable colors even through piping.

// create application/json parser
var jsonParser = bodyParser.json();

/** ===========
 *   = LOGGING =
 *   = =========
 *   set up logging framework in the app
 *   when NODE_ENV is set to development (like in gulp watch),
 *   don't log at all (TODO: make an exception for basic stuff
 *   like: listening on port: XXXX)
 */
if (process.env.NODE_ENV === 'development' || !argv.dist) {
  // remove logging completely
  /*var noop = function() {
        return console;
    };
    var console = {
        time: noop,
        date: noop,
        tag: noop,
        t: noop,
        file: noop,
        f: noop,
        info: noop,
        log: noop,
        error: noop,
        warning: noop
    };
    process.console = console;*/
} else {
  app.use(scribe.express.logger());
}
app.use('/logs', scribe.webPanel());

/** ================
 *   = STATIC FILES =
 *   = ==============
 *   set static files location used for requests that our frontend will make
 */
app.use(express.static(publicFolder));

/** =================
 *   = SERVE FAVICON =
 *   = ===============
 *   serve the favicon.ico so that modern browsers will show a
 *   "tab" and favorites icon
 */
app.use(favicon(path.join(__dirname,
  'public', 'assets', 'images', 'favicon.ico')));

/** ==================
 *   = ROUTES FOR API =
 *   = ================
 *   set the routes for our server's API
 */
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', jsonParser, apiRoutes);

/** =============
 *   = FRONT-END =
 *   = ===========
 *   Main 'catch-all' route to send users to frontend
 */
/* NOTE(thatkookooguy): has to be registered after API ROUTES */
app.get('*', function(req, res) {
  res.sendFile(path.join(publicFolder + '/index.html'));
});

module.exports = app;
