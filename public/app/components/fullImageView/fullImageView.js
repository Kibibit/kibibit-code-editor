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

    vm.addFullImageView = addFullImageView;

    EventManagerService.on('resized', resizeFullImageView);

    EventManagerService.onComponentDestroy($scope, function() {
      EventManagerService.off('resized', resizeFullImageView);
    });

    function addFullImageView(element) {
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
    }

    function resizeFullImageView() {
      if (vm.viewer) {
        vm.viewer.resize();
      }
    }

  }
]);
