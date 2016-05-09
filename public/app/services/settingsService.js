angular.module('kibibitCodeEditor')

.service('SettingsService', ['Fullscreen', function(Fullscreen) {
  var vm = this;

  /* init */
  vm.settings = new Settings();

  function Settings() {
    var settings = this;
    /* INIT */
    var cursor = {row: '0', column: '0'};
    var isFullscreen = false;
    var currentUndoManager = undefined;
    var currentEditor = undefined;

    /* EXPOSE SIMPLE VARS */
    // This are probably better off in state instead of settings. but they're here for now :-)
    settings.editorSettings = {
      lineLength: 80
    };
    settings.cursor = cursor;
    settings.currentUndoManager = currentUndoManager;
    settings.currentEditor = currentEditor;

    settings.__defineSetter__('isFullscreen', function(newValue) {

      console.assert(isBoolean(newValue), {
        'message': 'isFullscreen should only be a boolean, but was given some other type',
        'currentValue': isFullscreen,
        'newValue': newValue
      });

      if (newValue !== currentFullscreenState()) {
        if (newValue) {
          Fullscreen.all();
        } else {
          Fullscreen.cancel();
        }
      }
    });

    settings.__defineGetter__('isFullscreen', function() {
      return currentFullscreenState();
    });

    settings.__defineSetter__('lineLength', function(newValue) {
      console.assert(Number.isInteger(newValue), {
        'message': 'lineLength should only be a integer, but was given some other type',
        'currentValue': settings.editorSettings.lineLength,
        'newValue': newValue
      });

      if (newValue !== settings.editorSettings.lineLength) {
        settings.currentEditor.setPrintMarginColumn(newValue);
        settings.editorSettings.lineLength = newValue;
      }
    });

  }
  
  function isBoolean(value) {
    return value === true || value === false;
  }

  function currentFullscreenState() {
    return $(window).data('fullscreen-state');
  }

}]);
