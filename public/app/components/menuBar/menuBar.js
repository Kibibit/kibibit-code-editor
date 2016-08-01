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
    var seperator = (!isOSX || keys.length > 2) ? '+' : '';
    var abbreviations = {
      M: isOSX ? '⌘' : 'Ctrl',
      A: isOSX ? 'Option' : 'Alt',
      S: 'Shift'
    };
    return keys.map(function(key, index) {
      var last = index == keys.length - 1;
      return last ? key : abbreviations[key];
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

  vm.svgMorphOptions = {
    duration: 375
  };

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

});
