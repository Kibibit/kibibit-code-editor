angular.module('kibibitCodeEditor')

.service('ProjectService', [
  '$http',
  '$window',
  '$q',
  'SessionStorageService',
  function($http, $window, $q, SessionStorageService) {
    var vm = this;

    vm.getProjectLogo = function(folderToGet) {
      var deferred = $q.defer();

      $http.get('/api/projectLogo/' + encodeURIComponent(folderToGet))
        .then(function(res) {
          if (angular.isNumber(res.errno)) {
            console.error(res.errno);
            deferred.reject(res);
          } else {
            deferred.resolve(res.data);
          }
        }, function(httpError) {
          deferred.reject(httpError);
        });

      return deferred.promise;
    };

    vm.saveNewTheme = function(colorHex, projectName) {
      return $http.put('/api/createTheme/' +
        encodeURIComponent(colorHex) + '/' +
        encodeURIComponent(projectName));
    };

    vm.rgbToHex = rgbToHex;

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(rgb) {
        return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
    }
  }
]);
