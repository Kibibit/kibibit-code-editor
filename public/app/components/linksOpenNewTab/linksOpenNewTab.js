angular.module('kibibitCodeEditor')

.directive('kbLinksOpenNewTab', function() {
  return {
    link: function(scope, element) {
      scope.$watch(function() {
        return element.html();
      }, function() {
        var elems =
          (element.prop('tagName') === 'A') ? element : element.find('a');
        elems.attr('target', '_blank');
      });
    }
  };
});
