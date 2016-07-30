angular.module('kibibitCodeEditor')

.factory('TinyColorService', ['$window', function($window) {
  return {
    TinyColor: tinycolor
  };
 }]);
