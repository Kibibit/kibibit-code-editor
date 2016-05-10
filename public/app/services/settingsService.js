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
      ruler: 80,
      lineWrap: false
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

    settings.__defineSetter__('lineWrap', function(newValue) {
      console.assert(isBoolean(newValue), {
        'message': 'lineWrap should only be a boolean, but was given some other type',
        'currentValue': settings.editorSettings.lineWrap,
        'newValue': newValue
      });
      if (newValue !== settings.editorSettings.lineWrap) {
        var session = settings.currentEditor.getSession();
        session.setUseWrapMode(newValue);
        settings.editorSettings.lineWrap = newValue;
      }
    });

    settings.__defineGetter__('lineWrap', function() {
      return settings.editorSettings.lineWrap;
    });

    settings.__defineSetter__('ruler', function(newValue) {
      
      console.assert(Number.isInteger(newValue), {
        'message': 'Ruler should only be a integer, but was given some other type',
        'currentValue': settings.editorSettings.ruler,
        'newValue': newValue
      });

      if (newValue !== settings.editorSettings.ruler) {
        var editor = settings.currentEditor;
        editor.setShowPrintMargin(newValue != 0);
        editor.setPrintMarginColumn(newValue);
        settings.editorSettings.ruler = newValue;
      }
    });

    settings.__defineGetter__('ruler', function() {
      return settings.editorSettings.ruler;
    });
  }
  
  function isBoolean(value) {
    return value === true || value === false;
  }

  function currentFullscreenState() {
    return $(window).data('fullscreen-state');
  }

}]);
