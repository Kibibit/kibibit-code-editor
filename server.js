// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'), // call express
    compression = require('compression'),
    helmet = require('helmet'),
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'), // set favicon
    bodyParser = require('body-parser'),
    colors = require('colors'),
    logo = require('./printLogo'),
    argv = require('yargs').argv,
    ngrok = require('ngrok');
var app = express(); // define our app using express
var scribe = require('scribe-js')(); // used for logs
var console = require('./app/models/consoleService')
  ('MAIN PROCESS', ['magenta', 'inverse']);

var token = '';

var publicFolder = __dirname + (argv.dist ? '/public/dist' : '/public');

if (argv.dist) {
    console.info('!!PRODUCTION!!');
}

// hook helmet to our express app. This adds some protection to each communication with the server
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
 *   serve the favicon.ico so that modern browsers will show a "tab" and favorites icon
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
    ngrok.authtoken(token, function(err, token) {
        if (err) {
            console.error(err);
        }
    });
    ngrok.connect(config.port, function (err, url) {
        if (err) {
            console.error(err);
        } else {
            console.info(colors.cyan('ngrok') + ' - serving your site from ' + colors.yellow(url));
        }
    });
}
