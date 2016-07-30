angular.module('kibibitCodeEditor')

.controller('themeController', [
  '$rootScope',
  '$timeout',
  '$window',
  'ProjectService',
  'SessionStorageService',
  'TinyColorService',
  function(
    $scope,
    $timeout,
    $window,
    ProjectService,
    SessionStorageService,
    TinyColorService) {

    var vm = this;

    vm.myDominantColor;
    vm.palette;

    $window.themeCtrl = vm;

    vm.theme = ProjectService.theme;

    ProjectService.onSetTheme = function(newTheme) {
      vm.theme = newTheme;
    };

    $scope.$watch(function() {
      return vm.myDominantColor;
    }, function(newVal) {
      if (newVal) {
        // main color
        var projectColor = new TinyColorService.TinyColor({
          r: newVal[0],
          g: newVal[1],
          b: newVal[2]
        });

        // secondary color
        var anotherColor;

        if (vm.palette && vm.palette[1]) {
          anotherColor = new TinyColorService.TinyColor({
            r: vm.palette[1][0],
            g: vm.palette[1][1],
            b: vm.palette[1][2],
          });
        }

        // if first color is too extreme, get 2nd color
        projectColor =
          (projectColor.getBrightness() < 50 ||
            projectColor.getBrightness() > 200) &&
          anotherColor ?
          anotherColor : projectColor;

        // if color is still dark, lighten it
        while (projectColor.isDark()) {
          projectColor.lighten();
        }

        // if color is still light, lighten it
        while (projectColor.getBrightness() > 200) {
          projectColor.darken();
        }

        ProjectService.saveNewTheme(
          projectColor.toHexString(),
          $window.sessionStorage.projectName || 'project')
          .then(function(res) {
            if (res.errno) {

            } else {
              vm.theme = res.data.themeName;
              SessionStorageService.theme = vm.theme;
            }
          }, function(error) {
            console.error(error);
          });
      } else {
        vm.theme = undefined;
        SessionStorageService.removeItem('theme');
      }
    });

  }]);
