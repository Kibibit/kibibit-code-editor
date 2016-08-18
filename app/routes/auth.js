module.exports = function(app, express) {

  var qs = require('querystring');
  var express = require('express');
  var jwt = require('jwt-simple');
  var request = require('request');
  var fs = require('fs');
  var User = require('../models/_user');
  var moment = require('moment');

  var authRouter = express.Router();

  var config = {
    TOKEN_SECRET: 'kibibitIsAwesome'
  };

  //var users = userHomeDirectory + '/.users.json';

  authRouter.route('/github')
    .post(function(req, res) {
      var accessTokenUrl = 'https://github.com/login/oauth/access_token';
      var userApiUrl = 'https://api.github.com/user';
      var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: 'f0c57fb762f6fe9e7472eb23a8de902265bd5f63',
        redirect_uri: req.body.redirectUri
      };

      // Step 1. Exchange authorization code for access token.
      request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
        accessToken = qs.parse(accessToken);
        var headers = { 'User-Agent': 'Satellizer' };

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {

          // Step 3a. Link user accounts.
          if (req.header('Authorization')) {
            User.findOne({ github: profile.id }, function(err, existingUser) {
              if (existingUser) {
                return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
              }
              var token = req.header('Authorization').split(' ')[1];
              var payload = jwt.decode(token, config.TOKEN_SECRET);
              User.findById(payload.sub, function(err, user) {
                if (!user) {
                  return res.status(400).send({ message: 'User not found' });
                }
                user.set('github', profile.id);
                user.set('picture', user.picture || profile.avatar_url);
                user.set('displayName', user.login || user.displayName || profile.name);
                user.save(function() {
                  var token = createJWT(user);
                  res.send({ token: token });
                });
              });
            });
          } else {
            // Step 3b. Create a new user account or return an existing one.
            User.findOne({ github: profile.id }, function(err, existingUser) {
              if (existingUser) {
                var token = createJWT(existingUser);
                return res.send({ token: token });
              }
              var user = new User({});
              user.set('github', profile.id);
              user.set('picture', profile.avatar_url);
              user.set('displayName', profile.login || profile.name)
              user.save(function() {
                var token = createJWT(user);
                res.send({ token: token });
              });
            });
          }
        });
      });
    });

    authRouter.route('/getUser')
    .get(function(req, res) {
      res.json({
        "user": User.getAllUsers()[0]
      });
    });

    /*
   |--------------------------------------------------------------------------
   | Generate JSON Web Token
   |--------------------------------------------------------------------------
   */
  function createJWT(user) {
    var payload = {
      sub: user._id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
  }

  return authRouter;
};