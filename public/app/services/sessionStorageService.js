angular.module('kibibitCodeEditor')

.factory('SessionStorageService', ['$window', function($window) {
   return $window.sessionStorage;
 }]);