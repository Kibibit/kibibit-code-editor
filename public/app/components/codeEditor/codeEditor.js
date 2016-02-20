angular.module('kibibitCodeEditor')

.directive('codeEditor', function() {
  return {
    scope: {},
    bindToController: {
      code: '='
    },
    controller: 'codeEditorController',
    controllerAs: 'codeEditorCtrl',
    templateUrl: 'app/components/codeEditor/codeEditorTemplate.html'
  };
})

.controller('codeEditorController', function() {
  var vm = this;

  // initialize the editor session
  vm.aceLoaded = function(_editor) {
    vm.aceSession = _editor.getSession();
  };
  // save the content of the editor on-change
  vm.aceChanged = function() {
    vm.aceDocumentValue = vm.aceSession.getDocument().getValue();
  };

  vm.editorOptions = {
    mode: 'javascript',
    theme: 'monokai',
    onLoad: vm.aceLoaded,
    onChange: vm.aceChanged
  };
})

.directive('kbChangeAceScroll', ['$compile', function($compile) {
  return {
    scope: true,
    link: function(scope, element, attrs) {
      var scrollbarY = element.find('.ace_scrollbar.ace_scrollbar-v');
      var scrollbarX = element.find('.ace_scrollbar.ace_scrollbar-h');
      scrollbarY.attr('ng-scrollbars', '');
      scrollbarX.attr('ng-scrollbars', '');
      scope.config = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: false // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        axis: 'yx', // enable 2 axis scrollbars by default,
        theme: 'minimal',
        autoHideScrollbar: true
    };
      $compile(scrollbarY)(scope);
      $compile(scrollbarX)(scope);
    }
  };
}]);