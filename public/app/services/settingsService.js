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
    var editorSettings = new EditorSettings();

    /* EXPOSE SIMPLE VARS */
    // This are probably better off in state instead of settings. but they're here for now :-)
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

    settings.__defineGetter__('editorSettings', function() {
      return editorSettings;
    });

    function EditorSettings() {
      var ruler = 80;
      var lineWrap = false;
      var lineWrapColumn = 0;

      this.__defineGetter__('ruler', function() {
        return ruler;
      });

      this.__defineSetter__('ruler', function(newValue) {
        console.assert(Number.isInteger(newValue), {
          'message': 'Ruler should only be a integer, but was given some other type',
          'currentValue': ruler,
          'newValue': newValue
        });
        if (newValue !== ruler) {
          if (settings.currentEditor) {
            var editor = settings.currentEditor;
            editor.setShowPrintMargin(newValue != 0);
            editor.setPrintMarginColumn(newValue);
          }
          ruler = newValue;
        }
      });

      this.__defineGetter__('lineWrap', function() {
        return lineWrap;
      });

      this.__defineSetter__('lineWrap', function(newValue) {
        console.assert(isBoolean(newValue), {
          'message': 'lineWrap should only be a boolean, but was given some other type',
          'currentValue': lineWrap,
          'newValue': newValue
        });
        if (newValue !== lineWrap) {
          if (settings.currentEditor) {
            var session = settings.currentEditor.getSession();
            session.setUseWrapMode(newValue);
          }
          lineWrap = newValue;
        }
      });

      this.__defineGetter__('lineWrapColumn', function() {
        return lineWrapColumn;
      });

      this.__defineSetter__('lineWrapColumn', function(newValue) {
        console.assert(Number.isInteger(newValue), {
          'message': 'lineWrapColumn should only be a integer, but was given some other type',
          'currentValue': lineWrapColumn,
          'newValue': newValue
        });

        if (newValue !== lineWrapColumn) {
          if (settings.currentEditor) {
            var session = settings.currentEditor.getSession();
            session.setWrapLimit(newValue);
          }
          lineWrapColumn = newValue;
        }
      });
    }
  }
  
  function isBoolean(value) {
    return value === true || value === false;
  }

  function currentFullscreenState() {
    return $(window).data('fullscreen-state');
  }

}]);
