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
});
