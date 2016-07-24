angular.module('kibibitCodeEditor')

.directive('kbFullImageView', function() {
  return {
    scope: {},
    controller: 'fullImageViewController',
    controllerAs: 'fullImageViewCtrl',
    link: function(scope, element, attrs, fullImageViewCtrl) {
      fullImageViewCtrl.addFullImageView(element);

      scope.$watch(function() {
        return element.attr('src');
      }, function() {
        if (fullImageViewCtrl.viewer) {
          fullImageViewCtrl.viewer.update();
        }
      });
    }
  };
})

.controller('fullImageViewController', [
  '$scope',
  'SettingsService',
  'EventManagerService',
  function($scope, SettingsService, EventManagerService) {
    var vm = this;

    SettingsService.settings.canCurrentViewSave = false;

    vm.addFullImageView = function(element) {
      if (window.Viewer) {
        element.css({
          visibility: 'hidden'
        });
        // View one image
        vm.viewer = new Viewer(element[0], {
          inline: true,
          title: false,
          button: false,
          navbar: false
        });
      }
    };

    function resize() {
      if (vm.viewer) {
        vm.viewer.resize();
      }
    }

    EventManagerService.on('resized', resize);

    $scope.$on('$destroy', function() {
      EventManagerService.off('resized', resize);
    });

  }
]);
