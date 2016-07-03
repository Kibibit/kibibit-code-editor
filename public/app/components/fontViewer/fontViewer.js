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
  '$http',
  function($http) {
    var vm = this;

    vm.updateFontView = function(fontObject) {
      //TODO create a download service much like file/folder service
      $http.get('/api/download/' + encodeURIComponent(fontObject.path)).then(
        function(res) {
          console.log('res: ',res);
        },
        function(err) {
          console.log('err: ', err);
        }
      )
    }


  }
]);
