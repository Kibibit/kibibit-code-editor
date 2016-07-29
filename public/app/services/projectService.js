angular.module('kibibitCodeEditor')

.service('ProjectService', [
  '$http',
  '$window',
  'SessionStorageService',
  function($http, $window, SessionStorageService) {
    var vm = this;

    vm.getProjectLogo = function(folderToGet) {
      return $http.get('/api/projectLogo/' + encodeURIComponent(folderToGet));
    };

    vm.saveNewTheme = function(colorHex) {
      return $http.put('/api/createTheme/' + encodeURIComponent(colorHex));
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
