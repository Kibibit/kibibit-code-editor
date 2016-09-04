angular.module('kibibitCodeEditor')

.directive('kbMenuBar', function() {
  return {
    controller: 'menuBarController',
    controllerAs: 'menuBarCtrl',
    templateUrl: 'app/components/menuBar/menuBarTemplate.html'
  };
})

.filter('keyboardShortcut', ['$window', function($window) {
  return function(str) {
    if (!str) { return; }
    var keys = str.split('-');
    var isOSX = /Mac OS X/.test($window.navigator.userAgent);
    var seperator =
      (!isOSX || keys.length > 2 || keys[0] === '_Ctrl') ? '+' : '';
    var abbreviations = {
      M: isOSX ? '⌘' : 'Ctrl',
      A: isOSX ? 'Option' : 'Alt',
      S: 'Shift'
    };
    return keys.map(function(key, index) {
      var last = index == keys.length - 1;
      return key.startsWith('_') ?
        key.slice(1) : (last ? key : abbreviations[key]);
    }).join(seperator);
  };
}])

.controller('menuBarController', [
  '$window',
  '$timeout',
  'SettingsService',
  'ngDialog',
  'FileService',
  'ToastService',
  function(
    $window,
    $timeout,
    SettingsService,
    ngDialog,
    FileService,
    ToastService) {

    var vm = this;

    var svgMorphOptions = {
      duration: 375
    };

    ////////////

    vm.canChangeCase = canChangeCase;
    vm.changeSelectionToCamelCase = changeSelectionToCamelCase;
    vm.changeSelectionToKebabCase = changeSelectionToKebabCase;
    vm.changeSelectionToSnakeCase = changeSelectionToSnakeCase;
    vm.changeSelectionToTitleCase = changeSelectionToTitleCase;
    vm.cutSelection = cutSelection;
    vm.execEditorCommand = execEditorCommand;
    vm.focusEditor = focusEditor;
    vm.hasRedo = hasRedo;
    vm.hasUndo = hasUndo;
    vm.isMultiLineSelection = isMultiLineSelection;
    vm.isSelectionExists = isSelectionExists;
    vm.openPrintDialog = openPrintDialog;
    vm.sampleAction = sampleAction;
    vm.saveCurrentEditor = saveCurrentEditor;
    vm.settings = SettingsService.settings;
    vm.svgMorphOptions = svgMorphOptions;
    vm.toggleFullscreen = toggleFullscreen;
    vm.toggleGutter = toggleGutter;
    vm.toggleLineWrap = toggleLineWrap;
    vm.toggleSoftTabs = toggleSoftTabs;

    ////////////

    function canChangeCase() {
      var selectionText = vm.settings.currentEditor ?
        vm.settings.currentEditor.getSelectedText() : '';

      return /[-_\sA-Z]/.test(selectionText);
    }

    function changeSelectionToCamelCase() {
      var editor = vm.settings.currentEditor;
      var selectionText = editor.getSelectedText();
      var selection = vm.settings.currentEditor.selection.getRange();
      var camelCased = selectionText.replace(
        /[_-\s]([a-zA-Z])/g,
        function(g) {
          return g[1].toUpperCase();
        }
      );
      camelCased = camelCased[0].toLowerCase() + camelCased.substring(1);
      vm.settings.currentEditor.session.replace(
      selection, camelCased);

      editor.focus();
    }

    function changeSelectionToKebabCase() {
      var editor = vm.settings.currentEditor;
      var selectionText = editor.getSelectedText();
      var selection = vm.settings.currentEditor.selection.getRange();
      var kebabCased = selectionText.replace(
        /[_-\s]([a-zA-Z])|([a-z])([A-Z])/g,
        function(g, singleLetter, firstLetter, secondLetter) {
          return secondLetter ?
            firstLetter + '-' + secondLetter.toLowerCase() :
            '-' + singleLetter.toLowerCase();
        }
      );

      kebabCased = kebabCased.toLowerCase();
      vm.settings.currentEditor.session.replace(
      selection, kebabCased);

      editor.focus();
    }

    function changeSelectionToSnakeCase() {
      var editor = vm.settings.currentEditor;
      var selectionText = editor.getSelectedText();
      var selection = vm.settings.currentEditor.selection.getRange();
      var snakeCased = selectionText.replace(
        /[_-\s]([a-zA-Z])|([a-z])([A-Z])/g,
        function(g, singleLetter, firstLetter, secondLetter) {
          return secondLetter ?
            firstLetter + '_' + secondLetter.toLowerCase() :
            '_' + singleLetter.toLowerCase();
        }
      );

      snakeCased = snakeCased.toLowerCase();
      vm.settings.currentEditor.session.replace(
      selection, snakeCased);

      editor.focus();
    }

    function changeSelectionToTitleCase() {
      var editor = vm.settings.currentEditor;
      var selectionText = editor.getSelectedText();
      var selection = vm.settings.currentEditor.selection.getRange();
      var titleCased = selectionText.replace(
        /[_-\s]([a-zA-Z])|([a-z])([A-Z])/g,
        function(g, singleLetter, firstLetter, secondLetter) {
          return secondLetter ?
            firstLetter + ' ' + secondLetter.toUpperCase() :
            ' ' + singleLetter.toUpperCase();
        }
      );

      titleCased = titleCased[0].toUpperCase() + titleCased.substring(1);
      vm.settings.currentEditor.session.replace(
      selection, titleCased);

      editor.focus();
    }

    function cutSelection(e) {
      vm.settings.currentEditor.session.replace(
        vm.settings.currentEditor.selection.getRange(), '');

      vm.settings.currentEditor.focus();
    }

    function execEditorCommand(command) {
      var editor = vm.settings.currentEditor;
      if (editor) {
        editor.execCommand(command);
        editor.focus();
      }
    }

    function focusEditor() {
      var editor = vm.settings.currentEditor;
      editor.focus();
    }

    function hasRedo() {
      if (vm.settings.currentUndoManager &&
          vm.settings.currentUndoManager.hasRedo) {
        vm.enableRedo = vm.settings.currentUndoManager.hasRedo();
        return vm.enableRedo;
      } else {
        return false;
      }
    }

    function hasUndo() {
      if (vm.settings.currentUndoManager &&
          vm.settings.currentUndoManager.hasUndo) {
        vm.enableUndo = vm.settings.currentUndoManager.hasUndo();
        return vm.enableUndo;
      } else {
        return false;
      }
    }

    function isMultiLineSelection() {
      var selectionRange = vm.settings.currentEditor ?
        vm.settings.currentEditor.getSelectionRange() : undefined;

      if (!selectionRange) {
        return;
      }

      var startLine = selectionRange.start.row;
      var endLine = selectionRange.end.row;

      return endLine > startLine;
    }

    function isSelectionExists() {
      var editor = vm.settings.currentEditor;
      return editor ? editor.getSelectedText() !== '' : false;
    }

    function openPrintDialog() {
      // timeout to let the menu close before the print dialog appears
      $timeout(function() {
        $window.print();
      });
    }

    // should be deleted eventually
    function sampleAction(name, ev) {
      ngDialog.open({
        template: '<p>You triggered the "' + name + '" action</p>',
        plain: true
      });
    }

    function saveCurrentEditor(openFilePath) {
      var currentEditor = vm.settings.currentEditor;
      if (currentEditor && openFilePath) {
        FileService.saveFile(openFilePath,
          currentEditor.getSession().getDocument().getValue(),
          function() {
            ToastService.showSimpleToast('success-toast',
              'File successfully saved');
          }
        );
      }
    }

    function toggleFullscreen() {
      vm.settings.isFullscreen = !vm.settings.isFullscreen;
    }

    function toggleGutter() {
      var editorSettings = vm.settings.editorSettings;
      editorSettings.isGutter = !editorSettings.isGutter;
    }

    function toggleLineWrap() {
      vm.settings.editorSettings.lineWrap = !vm.settings.editorSettings.lineWrap;
    }

    function toggleSoftTabs() {
      var editorSettings = vm.settings.editorSettings;
      editorSettings.isSoftTabs = !editorSettings.isSoftTabs;
    }

  }
]);
