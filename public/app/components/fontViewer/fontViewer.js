angular.module('kibibitCodeEditor')

.directive('kbFontViewer', function() {
  return {
    scope: {},
    bindToController: {
      openFont: "=kbOpenFont"
    },
    controller: 'fontViewerController',
    controllerAs: 'fontViewerCtrl',
    link: function(scope, element, attrs, fontViewerCtrl) {
      scope.$watch('fontViewerCtrl.openFont', function(newOpenFont) {
        fontViewerCtrl.updateFontView(newOpenFont);
      });
    }
  };
})

.controller('fontViewerController', [
  function() {
    var vm = this;

    vm.updateFontView = function(fontObject) {
      console.log('fontObject: ', fontObject);
    }

  }
]);
