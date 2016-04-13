angular.module('kibibitCodeEditor')

.directive('menuBar', function() {
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

.controller('menuBarController', function(SettingsService, ngDialog) {
  var vm = this;
  vm.settings = {
    printLayout: true,
    showRuler: true,
    showSpellingSuggestions: true,
    presentationMode: 'edit'
  };
  vm.sampleAction = function(name, ev) {
    ngDialog.open({
      template: '<p>You triggered the "' + name + '" action</p>',
      plain: true
    });
  };

  vm.settings = SettingsService.getSettings();

  vm.hasUndo = function() {
    if (vm.settings.currentUndoManager &&
        vm.settings.currentUndoManager.hasUndo) {
      return vm.settings.currentUndoManager.hasUndo();
    } else {
      return false;
    }
  };

  vm.hasRedo = function() {
    if (vm.settings.currentUndoManager &&
        vm.settings.currentUndoManager.hasRedo) {
      return vm.settings.currentUndoManager.hasRedo();
    } else {
      return false;
    }
  };
});
