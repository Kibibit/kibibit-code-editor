angular.module('kibibitCodeEditor')
// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, $location) {
	var interceptorFactory = {};
	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {
		// grab the token
		var token = localStorage.kibibit_token;
		// if the token exists, add it to the header as x-access-token
		if (token)
			config.headers['x-access-token'] = token;
		return config;
	};
	// happens on response errors
	interceptorFactory.responseError = function(response) {
		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			localStorage.removeItem('kibibit_token');
			$location.path('/login');
		}
		// return the errors from the server as a promise
		return $q.reject(response);
	};
	return interceptorFactory;
});