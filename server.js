// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'), // call express
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'), // set favicon
    bodyParser = require('body-parser'),
    colors = require('colors'),
    logo = require('./printLogo');
var app = express(); // define our app using express
var scribe = require('scribe-js')(); // used for logs
var console = process.console;

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
if (process.env.NODE_ENV === 'development') {
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
app.use(express.static(__dirname + '/public'));

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
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

/** ==========
 *   = SERVER =
 *   = ========
 */
var port = process.env && process.env.PORT ? process.env.PORT : config.port;
app.listen(port, function() {
  logo();
  console.time()
    .info('Server listening at port ' + colors.bgBlue.dim.bold(port))
});
