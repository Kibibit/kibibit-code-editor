angular.module('kibibitCodeEditor')

.directive('jsonEditor', function() {
  return {
    scope: {},
    bindToController: {
      code: '='
    },
    controller: 'jsonEditorController',
    controllerAs: 'jsonEditorCtrl',
    templateUrl: 'app/components/jsonEditor/jsonEditorTemplate.html',
  };
})

.controller('jsonEditorController', [
  '$timeout',
  'SettingsService',
  'JSONFormatterConfig',
  function(
    $timeout,
    SettingsService,
    JSONFormatterConfig) {

    var vm = this;

    JSONFormatterConfig.hoverPreviewEnabled = true;
    JSONFormatterConfig.hoverPreviewArrayCount = 100;
    JSONFormatterConfig.hoverPreviewFieldCount = 5;

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
      try {
        vm.aceDocumentJson = JSON.parse(vm.aceDocumentValue);
      } catch (e) {}
    };
    vm.editorOptions = {
      mode: 'json',
      theme: 'monokai',
      onLoad: vm.aceLoaded,
      onChange: vm.aceChanged
    };
  }
]);
