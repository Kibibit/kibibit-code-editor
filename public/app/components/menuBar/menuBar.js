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

.controller('menuBarController', function(SettingsService, ngDialog, deviceDetector) {
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
    vm.settings.currentEditor.session.replace(vm.settings.currentEditor.selection.getRange(), '');
    vm.settings.currentEditor.focus();
  }

  vm.paste = function() {
    /*var pastedText = "";
      if (deviceDetector.browser === 'ie' || deviceDetector.browser === 'ms-edge') {
         pastedText = window.clipboardData.getData('Text');
      }
      else if (deviceDetector.browser === 'firefox') {
         pastedText = "";
      }
      else if (deviceDetector.browser === 'opera') {
         pastedText = evt.browserEvent.clipboardData.getData('text/plain');
      }
      else if (deviceDetector.browser === 'chrome' || deviceDetector.browser === 'safari') {
        //WebKit based browsers. i.e: Chrome, Safari
         pastedText = evt.browserEvent.clipboardData.getData('text/plain');
      }
    evt.stopEvent();
    if(pastedText.indexOf('#') == 0){
        pastedText = pastedText.substr(1,pastedText.length);
        this.setValue(pastedText);  
    }*/

    vm.settings.currentEditor.focus();
    var ev=document.createEvent("KeyboardEvent");
    ev.initKeyboardEvent('paste',true,true,window,true,false,false,false,86,86);
  };
});
