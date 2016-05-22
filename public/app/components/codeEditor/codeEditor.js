angular.module('kibibitCodeEditor')

.directive('kbCodeEditor', function() {
  return {
    scope: {},
    bindToController: {
      openFile: '=kbOpenFile'
    },
    controller: 'codeEditorController',
    controllerAs: 'codeEditorCtrl',
    templateUrl: 'app/components/codeEditor/codeEditorTemplate.html',
    link: function(scope, element, attrs, codeEditorCtrl) {
      scope.$watch('codeEditorCtrl.openFile', function(newOpenFile) {
        codeEditorCtrl.updateFileContent(newOpenFile);
      });
    }
  };
})

.controller('codeEditorController', [
  '$timeout',
  'FileService',
  'SettingsService',
  'JSONFormatterConfig',
  function(
    $timeout,
    FileService,
    SettingsService,
    JSONFormatterConfig) {

    var vm = this;
    var editor;
    var editorSettings = SettingsService.settings.editorSettings;

    // config JSON params
    JSONFormatterConfig.hoverPreviewEnabled = true;
    JSONFormatterConfig.hoverPreviewArrayCount = 100;
    JSONFormatterConfig.hoverPreviewFieldCount = 5;

    var init = function(settings) {
      editor.setOptions({
        'wrap': settings.lineWrap,
        'mode': 'ace/mode/' + settings.syntaxMode,
        'theme': 'ace/theme/' + settings.theme,
        'tabSize': settings.tabWidth,
        'fontSize': settings.fontSize,
        'showGutter': settings.isGutter,
        'useSoftTabs': settings.isSoftTabs,
        'showPrintMargin': settings.ruler
      });
    };

    vm.syntaxMode = function() { return editorSettings.syntaxMode; };

    // initialize the editor session
    vm.aceLoaded = function(_editor) {
      editor = _editor;
      vm.aceSession = editor.getSession();
      vm.undoManager = editor.getSession().getUndoManager();
      SettingsService.settings.currentUndoManager = vm.undoManager;
      SettingsService.settings.currentEditor = editor;
      init(editorSettings);
      // save cursor position
      editor.on('changeSelection', function() {
        $timeout(function() {
          var cursor = editor.selection.getCursor();
          cursor.row++;
          SettingsService.settings.cursor = cursor;
        });
      });
    };

    // save the content of the editor on-change
    vm.aceChanged = function(_editor) {
      vm.aceDocumentValue = vm.aceSession.getDocument().getValue();
      parseJson();
    };

    vm.attachedEditorFunctions = {
      onLoad: vm.aceLoaded,
      onChange: vm.aceChanged
    };

    vm.updateFileContent = function(filePath) {
      if (filePath !== '') {
        FileService.getFile(filePath, function(fileInfo) {
          vm.fileInfo = fileInfo.data;
          vm.code = vm.fileInfo.content;
          var fileMode = getModeFromMimeType(vm.fileInfo);
          editorSettings.syntaxMode = fileMode;
          vm.parsedJson = undefined;
          console.debug('changed mode to ' + fileMode);
        });
      }
    };

    vm.shouldShowCompiledView = function() {
      vm.showCompiledView = editorSettings.syntaxMode === 'json' || editorSettings.syntaxMode === 'markdown';
      return vm.showCompiledView;
    };

    function parseJson() {
      if (editorSettings.syntaxMode === 'json') {
        try {
          vm.parsedJson = JSON.parse(vm.aceDocumentValue);
        } catch (e) {}
      }
    };

    function getModeFromMimeType(file) {
      var getModeRegex = /\/(x-)?(.*)$/;
      return file && file.mimeType ?
        file.mimeType.match(getModeRegex)[2] :
        'text';
    }
  }
]);
