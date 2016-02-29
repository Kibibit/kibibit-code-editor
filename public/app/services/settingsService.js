angular.module('kibibitCodeEditor')

.service('SettingsService', ['$http', function($http) {
  var vm = this;

  /* init */
  var settings = {
    cursor: {row: '0', column: '0'}
  };

  vm.getSettings = function() {
    return settings;
  };

  vm.setSettings = function(newSetting) {
    newSetting = newSetting || {};
    settings = angular.extend(settings, newSetting);
    return settings;
  };
}]);
