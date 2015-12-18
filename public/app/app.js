angular.module('kibibitCodeEditor',
	['angular-loading-bar',
	'ngAnimate',
	'app.routes',
	'authService',
	'userCtrl',
	'userService',
	'treeControl',
	'ui.ace',
	'angularResizable',
	'angularModalService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');

});
