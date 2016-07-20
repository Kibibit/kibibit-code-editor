angular.module('kibibitCodeEditor')

.directive('kbMenuBar', function() {
  return {
    controller: 'menuBarController',
    controllerAs: 'menuBarCtrl',
    templateUrl: 'app/components/menuBar/menuBarTemplate.html'
  };
})

.filter('keyboardShortcut', function($window) {
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
})

.controller('menuBarController', function(
  $window,
  SettingsService,
  ngDialog,
  FileService,
  ToastService) {

  var vm = this;

  vm.sampleAction = function(name, ev) {
    ngDialog.open({
      template: '<p>You triggered the "' + name + '" action</p>',
      plain: true
    });
  };

  vm.settings = SettingsService.settings;

  vm.saveCurrentEditor = function(openFilePath) {
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
  };

  vm.hasUndo = function() {
    if (vm.settings.currentUndoManager &&
        vm.settings.currentUndoManager.hasUndo) {
      vm.enableUndo = vm.settings.currentUndoManager.hasUndo();
      return vm.enableUndo;
    } else {
      return false;
    }
  };

  vm.hasRedo = function() {
    if (vm.settings.currentUndoManager &&
        vm.settings.currentUndoManager.hasRedo) {
      vm.enableRedo = vm.settings.currentUndoManager.hasRedo();
      return vm.enableRedo;
    } else {
      return false;
    }
  };

  vm.cutSelection = function(e) {
    vm.settings.currentEditor.session.replace(
      vm.settings.currentEditor.selection.getRange(), '');

    vm.settings.currentEditor.focus();
  };

  vm.toggleFullscreen = function() {
    vm.settings.isFullscreen = !vm.settings.isFullscreen;
  };

  vm.toggleLineWrap = function() {
    vm.settings.editorSettings.lineWrap = !vm.settings.editorSettings.lineWrap;
  };

  vm.toggleSoftTabs = function() {
    var editorSettings = vm.settings.editorSettings;
    editorSettings.isSoftTabs = !editorSettings.isSoftTabs;
  };

  vm.toggleGutter = function() {
    var editorSettings = vm.settings.editorSettings;
    editorSettings.isGutter = !editorSettings.isGutter;
  };

  vm.changeSelectionToCamelCase = function() {
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
  };

  vm.changeSelectionToTitleCase = function() {
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
  };

  vm.changeSelectionToKebabCase = function() {
    var editor = vm.settings.currentEditor;
    var selectionText = editor.getSelectedText();
    var selection = vm.settings.currentEditor.selection.getRange();
    var titleCased = selectionText.replace(
      /[_-\s]([a-zA-Z])|([a-z])([A-Z])/g,
      function(g, singleLetter, firstLetter, secondLetter) {
        return secondLetter ?
          firstLetter + '-' + secondLetter.toLowerCase() :
          '-' + singleLetter.toLowerCase();
      }
    );

    titleCased = titleCased[0].toLowerCase() + titleCased.substring(1);
    vm.settings.currentEditor.session.replace(
    selection, titleCased);

    editor.focus();
  };

  vm.changeSelectionToSnakeCase = function() {
    var editor = vm.settings.currentEditor;
    var selectionText = editor.getSelectedText();
    var selection = vm.settings.currentEditor.selection.getRange();
    var titleCased = selectionText.replace(
      /[_-\s]([a-zA-Z])|([a-z])([A-Z])/g,
      function(g, singleLetter, firstLetter, secondLetter) {
        return secondLetter ?
          firstLetter + '_' + secondLetter.toLowerCase() :
          '_' + singleLetter.toLowerCase();
      }
    );

    titleCased = titleCased[0].toLowerCase() + titleCased.substring(1);
    vm.settings.currentEditor.session.replace(
    selection, titleCased);

    editor.focus();
  };

  vm.execEditorCommand = function(command) {
    var editor = vm.settings.currentEditor;
    if (editor) {
      editor.execCommand(command);
      editor.focus();
    }
  };

  vm.isSelectionExists = function() {
    var editor = vm.settings.currentEditor;
    return editor ? editor.getSelectedText() !== '' : false;
  };

  vm.canChangeCase = function() {
    var selectionText = vm.settings.currentEditor ?
      vm.settings.currentEditor.getSelectedText() : '';

    return /[-_\sA-Z]/.test(selectionText);

  };

  vm.isMultiLineSelection = function() {
    var selectionRange = vm.settings.currentEditor ?
      vm.settings.currentEditor.getSelectionRange() : undefined;

    if (!selectionRange) {
      return;
    }

    var startLine = selectionRange.start.row;
    var endLine = selectionRange.end.row;

    return endLine > startLine;
  };

});
