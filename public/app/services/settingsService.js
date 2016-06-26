angular.module('kibibitCodeEditor')

.service('SettingsService', [
  'Fullscreen',
  'CODE_EDITOR',
  'ERROR_MSGS',
  function(
    Fullscreen,
    CODE_EDITOR,
    ERROR_MSGS) {

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
      settings.editorSettings = editorSettings;
      // Expose ace's list to the view in order to show in input selectors
      settings.modelist = CODE_EDITOR.MODE_LIST;
      settings.themelist = CODE_EDITOR.THEME_LIST;

      settings.__defineSetter__('isFullscreen', function(newValue) {

        console.assert(isBoolean(newValue), {
          'message': ERROR_MSGS
            .TYPE_ERROR('isFullscreen', 'boolean', typeof newValue),
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

      function EditorSettings() {
        var editorSettings = this;
        /* INIT */
        var theme = 'monokai';
        var ruler = 80;
        var tabWidth = 4;
        var fontSize = 12;
        var isGutter = true;
        var lineWrap = false;
        var isReadOnly = false;
        var isSoftTabs = false;
        var syntaxMode = 'text';

        editorSettings.__defineGetter__('ruler', function() {
          return ruler;
        });

        editorSettings.__defineSetter__('ruler', function(newValue) {
          console.assert(Number.isInteger(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('ruler', 'integer', typeof newValue),
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

        editorSettings.__defineGetter__('lineWrap', function() {
          return lineWrap;
        });

        editorSettings.__defineSetter__('lineWrap', function(newValue) {
          console.assert(isBoolean(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('lineWrap', 'boolean', typeof newValue),
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

        editorSettings.__defineGetter__('fontSize', function() {
          return fontSize;
        });

        editorSettings.__defineSetter__('fontSize', function(newValue) {
          console.assert(Number.isInteger(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('fontSize', 'integer', typeof newValue),
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

        editorSettings.__defineGetter__('tabWidth', function() {
          return tabWidth;
        });

        editorSettings.__defineSetter__('tabWidth', function(newValue) {
          console.assert(Number.isInteger(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('tabWidth', 'integer', typeof newValue),
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

        editorSettings.__defineGetter__('isSoftTabs', function() {
          return isSoftTabs;
        });

        editorSettings.__defineSetter__('isSoftTabs', function(newValue) {
          console.assert(isBoolean(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('isSoftTabs', 'integer', typeof newValue),
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

        editorSettings.__defineGetter__('isGutter', function() {
          return isGutter;
        });

        editorSettings.__defineSetter__('isGutter', function(newValue) {
          console.assert(isBoolean(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('isGutter', 'boolean', typeof newValue),
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

        editorSettings.__defineGetter__('syntaxMode', function() {
          return syntaxMode;
        });

        editorSettings.__defineSetter__('syntaxMode', function(newValue) {
          if (!settings.currentEditor) {
            return;
          }

          var matchedMode = CODE_EDITOR.MODE_LIST.modesByName[newValue];
          matchedMode = matchedMode ?
            matchedMode :
            CODE_EDITOR.MODE_LIST.modesByName['text'];

          console.assert(matchedMode, {
            'message': ERROR_MSGS
              .MATCH_ERROR('syntaxMode', 'CODE_EDITOR.MODE_LIST.modesByName'),
            'currentValue': syntaxMode,
            'newValue': newValue
          });

          if (newValue !== syntaxMode) {
            if (settings.currentEditor) {
              var session = settings.currentEditor.getSession();
              session.setMode(matchedMode.mode);
            }
            syntaxMode = newValue;
          }
        });

        editorSettings.__defineGetter__('theme', function() {
          return theme;
        });

        editorSettings.__defineSetter__('theme', function(newValue) {
          var matchedTheme = CODE_EDITOR.THEME_LIST.themesByName[newValue];

          console.assert(matchedTheme, {
            'message': ERROR_MSGS
              .MATCH_ERROR('theme', 'CODE_EDITOR.THEME_LIST.themesByName'),
            'currentValue': syntaxMode,
            'newValue': newValue
          });

          if (newValue !== theme) {
            if (settings.currentEditor) {
              var editor = settings.currentEditor;
              editor.setTheme(matchedTheme.theme);
            }
            theme = newValue;
          }
        });

        editorSettings.__defineGetter__('isReadOnly', function() {
          return isReadOnly;
        });

        editorSettings.__defineSetter__('isReadOnly', function(newValue) {
          console.assert(isBoolean(newValue), {
            'message': ERROR_MSGS
              .TYPE_ERROR('isReadOnly', 'boolean', typeof newValue),
            'currentValue': isReadOnly,
            'newValue': newValue
          });

          if (newValue !== isReadOnly) {
            var editor = settings.currentEditor;
            editor.setReadOnly(newValue);
          }
          isReadOnly = newValue;
        });

      }
    }

    function isBoolean(value) {
      return value === true || value === false;
    }

    function currentFullscreenState() {
      return $(window).data('fullscreen-state');
    }
  }
]);
