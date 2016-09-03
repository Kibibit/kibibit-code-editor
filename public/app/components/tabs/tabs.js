angular.module('kibibitCodeEditor')

.directive('kbTabs', function() {
  return {
    scope: {},
    bindToController: {
      openFile: '=kbOpenFile'
    },
    controller: 'tabsController',
    controllerAs: 'tabsCtrl',
    templateUrl: 'app/components/tabs/tabsTemplate.html',
    link: function(scope, element, attrs, tabsCtrl) {
      scope.$watch('tabsCtrl.openFile', function(newOpenFile) {
        tabsCtrl.updateFileContent(newOpenFile);
      });
    }
  };
})

.controller('tabsController', [
  '$timeout',
  'FileService',
  'SettingsService',
  'JSONFormatterConfig',
  'ToastService',
  function(
    $timeout,
    FileService,
    SettingsService,
    JSONFormatterConfig,
    ToastService) {

    var vm = this;

    var untitledTab = {
      fileData: undefined
    };

    vm.selectedIndex = 0;
    vm.updateFileContent = updateFileContent;

    vm.tabs = [untitledTab];
    
    function updateFileContent() {
      if (!vm.openFile) {
        vm.tabs = [untitledTab];
      }
      if (vm.tabs.length === 1 && vm.tabs[0].fileData === undefined) {
        vm.tabs = [{
          fileData: vm.openFile
        }];
      } else {
        if (!_.includes(vm.tabs, vm.openFile)) {
          vm.tabs.push({
            fileData: vm.openFile
          });
        }
      }
    }
  }
]);
