angular.module('kibibitCodeEditor')

.controller('themeController', [
  '$rootScope',
  '$timeout',
  '$window',
  'ProjectService',
  function($scope, $timeout, $window, ProjectService) {

    var vm = this;

    vm.myDominantColor;

    $window.themeCtrl = vm;

    if ($window.sessionStorage.theme) {
      vm.theme = $window.sessionStorage.theme;
    }

    $scope.$watch(function() {
      return vm.myDominantColor;
    }, function(newVal) {
      if (newVal) {
        ProjectService.saveNewTheme(ProjectService.rgbToHex(newVal))
          .then(function(res) {
            vm.theme = res.data.themeName;
          }, function(error) {
            console.error(error);
          });
      }
    });

    /*$timeout(function() {
      $window.sessionStorage.theme = 'project';
      // $window.location.reload();
    }, 10000);*/

  }]);
