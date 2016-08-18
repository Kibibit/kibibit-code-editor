angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

  /**
   * Helper auth functions
   */
  var skipIfLoggedIn = function($q, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  };

  var loginRequired = function($q, $location, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.resolve();
    } else {
      $location.path('/login');
    }
    return deferred.promise;
  };

  $routeProvider

  // route for the home page
    .when('/', {
      templateUrl: 'app/views/home.html'
    })

    // login page
    .when('/login', {
      templateUrl: 'app/views/login.html',
      controller: 'mainController',
      controllerAs: 'login',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })

    // show all users
    .when('/users', {
      templateUrl: 'app/views/users/all.html',
      controller: 'userController',
      controllerAs: 'user'
    })

    // form to create a new user
    // same view as edit page
    .when('/users/create', {
      templateUrl: 'app/views/users/single.html',
      controller: 'userCreateController',
      controllerAs: 'user'
    })

    // page to edit a user
    .when('/users/:user_id', {
      templateUrl: 'app/views/users/single.html',
      controller: 'userEditController',
      controllerAs: 'user'
    });

  $locationProvider.html5Mode(true);

});
