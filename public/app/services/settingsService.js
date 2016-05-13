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
    var modelist = ace.require("ace/ext/modelist");
    var editorSettings = new EditorSettings();

    /* EXPOSE SIMPLE VARS */
    // This are probably better off in state instead of settings. but they're here for now :-)
    settings.cursor = cursor;
    settings.currentUndoManager = currentUndoManager;
    settings.currentEditor = currentEditor;
    settings.modelist = modelist;

    settings.__defineSetter__('isFullscreen', function(newValue) {

      console.assert(isBoolean(newValue), {
        'message': 'isFullscreen should be boolean',
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
      var tabWidth = 4;
      var fontSize = 12;
      var isGutter = true;
      var lineWrap = false;
      var isSoftTabs = false;
      var syntaxMode = 'javascript';
      var theme = 'monokai';

      this.__defineGetter__('ruler', function() {
        return ruler;
      });

      this.__defineSetter__('ruler', function(newValue) {
        console.assert(Number.isInteger(newValue), {
          'message': 'ruler should be integer',
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
          'message': 'lineWrap should be boolean',
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

      this.__defineGetter__('fontSize', function() {
        return fontSize;
      });

      this.__defineSetter__('fontSize', function(newValue) {
        console.assert(Number.isInteger(newValue), {
          'message': 'fontSize should be integer',
          'currentValue': fontSize,
          'newValue': newValue
        });

        if (newValue !== fontSize) {
          if (settings.currentEditor) {
            var editor = settings.currentEditor;
            editor.setFontSize(newValue);
          }
          fontSize = newValue;
        }
      });

      this.__defineGetter__('tabWidth', function() {
        return tabWidth;
      });

      this.__defineSetter__('tabWidth', function(newValue) {
        console.assert(Number.isInteger(newValue), {
          'message': 'tabWidth should be integer',
          'currentValue': tabWidth,
          'newValue': newValue
        });

        if (newValue !== tabWidth) {
          if (settings.currentEditor) {
            var session = settings.currentEditor.getSession();
            session.setTabSize(newValue);
          }
          tabWidth = newValue;
        }
      });

      this.__defineGetter__('isSoftTabs', function() {
        return isSoftTabs;
      });

      this.__defineSetter__('isSoftTabs', function(newValue) {
        console.assert(isBoolean(newValue), {
          'message': 'isSoftTabs should be integer',
          'currentValue': isSoftTabs,
          'newValue': newValue
        });

        if (newValue !== isSoftTabs) {
          if (settings.currentEditor) {
            var session = settings.currentEditor.getSession();
            session.setUseSoftTabs(newValue);
          }
          isSoftTabs = newValue;
        }
      });

      this.__defineGetter__('isGutter', function() {
        return isGutter;
      });

      this.__defineSetter__('isGutter', function(newValue) {
        console.assert(isBoolean(newValue), {
          'message': 'isGutter should be boolean',
          'currentValue': isGutter,
          'newValue': newValue
        });

        if (newValue !== isGutter) {
          if (settings.currentEditor) {
            var editor = settings.currentEditor;
            editor.renderer.setShowGutter(newValue);
          }
        }
        isGutter = newValue;
      });

      this.__defineGetter__('syntaxMode', function() {
        return syntaxMode;
      });

      this.__defineSetter__('syntaxMode', function(newValue) {
        console.assert(angular.isString(newValue), {
          'message': 'syntaxMode should be string',
          'currentValue': syntaxMode,
          'newValue': newValue
        });
        if (newValue !== syntaxMode) {
          if (settings.currentEditor) {
            var session = settings.currentEditor.getSession();
            session.setMode("ace/mode/" + newValue);
          }
        }
        syntaxMode = newValue;
      });

      this.__defineGetter__('theme', function() {
        return theme;
      });

      this.__defineSetter__('theme', function(newValue) {
        // TODO [Or Tichon]: add theme setter
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