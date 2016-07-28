angular.module('kibibitCodeEditor')

.service('ProjectService', ['$http', '$window', 'SessionStorageService', function($http, $window, SessionStorageService) {
  var vm = this;

  vm.getProjectLogo = function(folderToGet) {
    return $http.get('/api/projectLogo/' + encodeURIComponent(folderToGet))
      .then(function() {
        
      }, function() {

      });
  };

  vm.saveNewTheme = function(colorHex) {
    $http.put('/api/createTheme/' + encodeURIComponent(colorHex))
      .then(function(res) {
        console.log(res.errno);
        SessionStorageService.theme = 'project';
        $window.location.reload();
      });
  };
}]);
