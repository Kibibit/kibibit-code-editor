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
  function() {
    var vm = this;

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

  }
]);
