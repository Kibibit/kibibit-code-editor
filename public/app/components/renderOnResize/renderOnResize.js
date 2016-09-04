angular.module('kibibitCodeEditor')

.directive('kbRenderOnResize', [
  'EventManagerService',
  function(EventManagerService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(function() {
          return element.width();
        }, _.debounce(function(newValue, oldValue) {
          EventManagerService.trigger('resized');
        }, 500));
      }
    };
  }
]);
