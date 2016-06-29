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
  'ToastService',
  function(
    $timeout,
    FileService,
    SettingsService,
    JSONFormatterConfig,
    ToastService) {

    var vm = this;
    var editor;
    var settings = SettingsService.settings;
    var editorSettings = settings.editorSettings;

    settings.canCurrentViewSave = true;

    // config JSON params
    JSONFormatterConfig.hoverPreviewEnabled = true;
    JSONFormatterConfig.hoverPreviewArrayCount = 100;
    JSONFormatterConfig.hoverPreviewFieldCount = 5;

    var initEditor = function(editor, settings) {
      saveOnKeyboardShortcut(editor);
      listenToCursorPosition(editor);
      setEditorSettings(editor, settings);
    };

    var setEditorSettings = function(editor, settings) {
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

    var listenToCursorPosition = function(editor) {
      editor.on('changeSelection', function() {
        $timeout(function() {
          var cursor = editor.selection.getCursor();
          cursor.row++;
          SettingsService.settings.cursor = cursor;
        });
      });
    };

    var saveOnKeyboardShortcut = function(editor) {
      // Set {{ACTION}} + S to save inside ace.js
      // This is needed because ace.js is listening to events inside of ace,
      // so we need to hook to that
      editor.commands.addCommand({
        name: 'saveFile',
        bindKey: {
          win: 'Ctrl-S',
          mac: 'Command-S',
          sender: 'editor|cli'
        },
        exec: saveCurrentEditor
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
      initEditor(editor, editorSettings);
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

    vm.updateFileContent = function(fileObject) {
      if (fileObject) {
        vm.fileInfo = fileObject;
        vm.code = vm.fileInfo.content;
        var fileMode = getModeFromMimeType(vm.fileInfo);
        editorSettings.syntaxMode = fileMode;
        vm.parsedJson = undefined;
        console.debug('changed mode to ' + fileMode);
      }
    };

    vm.shouldShowCompiledView = function() {
      vm.showCompiledView =
        editorSettings.syntaxMode === 'json' ||
        editorSettings.syntaxMode === 'markdown';
      return vm.showCompiledView;
    };

    function parseJson() {
      // the parsedJson variable won't update if the json is invalid
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

    function saveCurrentEditor() {
    var currentEditor = editor;
    if (currentEditor && vm.fileInfo && vm.fileInfo.path) {
      FileService.saveFile(vm.fileInfo.path,
        currentEditor.getSession().getDocument().getValue(),
        function() {
          ToastService.showSimpleToast('success-toast',
            'File successfully saved');
        }
      );
    }
  };
  }
]);
