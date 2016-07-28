angular.module('kibibitCodeEditor')

.controller('themeController', [
  '$rootScope',
  '$timeout',
  '$window',
  function($scope, $timeout, $window) {

    var vm = this;

    if ($window.sessionStorage.theme) {
      vm.theme = $window.sessionStorage.theme;
    }

    /*$timeout(function() {
      $window.sessionStorage.theme = 'project';
      // $window.location.reload();
    }, 10000);*/

  }]);
