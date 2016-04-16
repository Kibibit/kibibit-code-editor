angular.module('kibibitCodeEditor')

.service('SettingsService', function() {
  var vm = this;

  /* init */
  var settings = {
    cursor: {row: '0', column: '0'},
    isFullscreen: false,
    currentUndoManager: undefined,
    currentEditor: undefined
  };

  vm.getSettings = function() {
    return settings;
  };

  vm.setSettings = function(newSetting) {
    newSetting = newSetting || {};
    settings = angular.extend(settings, newSetting);
    return settings;
  };
});
