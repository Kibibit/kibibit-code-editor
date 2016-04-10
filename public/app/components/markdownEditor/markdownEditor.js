angular.module('kibibitCodeEditor')

.directive('markdownEditor', function() {
  return {
    scope: {},
    bindToController: {
      code: '='
    },
    controller: 'markdownEditorController',
    controllerAs: 'markdownEditorCtrl',
    templateUrl: 'app/components/markdownEditor/markdownEditorTemplate.html',
  };
})

.controller('markdownEditorController', [
  '$timeout',
  'SettingsService',
  function(
    $timeout,
    SettingsService) {

    var vm = this;

    // initialize the editor session
    vm.aceLoaded = function(_editor) {
      vm.aceSession = _editor.getSession();
      // save cursor position
      _editor.on('changeSelection', function() {
        $timeout(function() {
          var cursor = _editor.selection.getCursor();
          cursor.row++;
          var settings = SettingsService.setSettings({
            cursor: cursor
          });
          console.debug('editor\'s cursor changed position:',
            settings.cursor);
        });
      });
    };
    // save the content of the editor on-change
    vm.aceChanged = function(_editor) {
      vm.aceDocumentValue = vm.aceSession.getDocument().getValue();
    };
    vm.editorOptions = {
      mode: 'markdown',
      theme: 'monokai',
      onLoad: vm.aceLoaded,
      onChange: vm.aceChanged
    };
  }
]);
