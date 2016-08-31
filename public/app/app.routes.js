angular.module('app.routes', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

  // route for the home page
        .when('/', {
          templateUrl: 'app/views/home.html'
        })

        // login page
    .when('/login', {
      templateUrl: 'app/views/login.html',
      controller: 'mainController',
      controllerAs: 'login'
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

}]);
