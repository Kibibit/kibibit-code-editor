var schemas = require("./schemas.js");
var _ = require("lodash");
var fs = require('fs');
var userHomeDirectory = require('user-home');
var createIfNotExist = require("create-if-not-exist");

var User = function (data) {
    this.data = data;
}

var usersPath = userHomeDirectory + '/users.json';

User.prototype.data = {}

User.prototype.changeName = function (name) {
    this.data.name = name;
}

User.prototype.get = function (name) {
    return this.data[name];
}

User.prototype.set = function (name, value) {
    this.data[name] = value;
}

User.prototype.sanitize = function (data) {
    data = data || {};
    schema = schemas.user;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

User.prototype.save = function (callback) {
    var self = this;
    this.data = this.data;
    var result = saveUser({github: this.data.github}, this.data);
    callback(null, result); 
}

User.findById = function (id, callback) {
    var data = getUsers({github: id});
    if (err) return callback(err);
    callback(null, new User(data));
}

User.findOne = function(findBy, callback) {
  var users = getUsers(findBy);
  if(!users || users.length === 0) {
    callback();
  } else {
    callback(undefined, users);
  }

}

User.getAllUsers = function() {
  return getUsers();
}

function getUsers(findBy) {
  createIfNotExist(usersPath, '{ "users":[] }');
  var users = JSON.parse(fs.readFileSync(usersPath, 'utf8')).users;
  if (!findBy) {
    return users;
  }
  return _.find(users, findBy);
}

function saveUser(findBy, newUserData) {
  if (!findBy || !newUserData) {
    return;
  }

  var users = getUsers();

  var match = _.find(users, findBy);
  if (match) {
      var index = _.indexOf(users, match);
      users.splice(index, 1, newUserData);
  } else {
      users.push(newUserData);
  }

  var usersFile = {
    "users": users
  };

  fs.writeFile(usersPath,
      JSON.stringify(usersFile, null, 2),
      'utf8',
      function(err) {
        if (err) {
          res.json(err);
          console.error('users couldn\'t be saved: ' + err);
        } else {
          console.info('users saved: ' + usersPath);
        }
      }
    );
}

module.exports = User;