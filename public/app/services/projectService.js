angular.module('kibibitCodeEditor')

.service('ProjectService', [
  '$http',
  '$window',
  '$q',
  'SessionStorageService',
  function($http, $window, $q, SessionStorageService) {
    var vm = this;

    var theme;

    if (SessionStorageService.theme) {
      theme = SessionStorageService.theme;
    }

    vm.setTheme = function(newTheme) {
      theme = newTheme;
      vm.onSetTheme(newTheme);
    };

    vm.onSetTheme = function(newTheme) {};

    vm.getProjectLogo = function(folderToGet) {
      var deferred = $q.defer();

      $http.get('/api/projectLogo/' + encodeURIComponent(folderToGet))
        .then(function(res) {
          if (angular.isNumber(res.data.errno)) {
            console.error(res.data.errno);
            deferred.reject(res.data);
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
  }
]);
