angular.module('kibibitCodeEditor')

.controller('mainController', [
  '$scope',
  '$http',
  'ngDialog',
  'SettingsService',
  function(
    $scope,
    $http,
    ngDialog,
    SettingsService) {

    var vm = this;

    window.mainCtrl = vm;

    vm.openFile = '';

    vm.settings = SettingsService.settings;

    if (sessionStorage.projectFolderPath) {
      vm.projectFolderPath = sessionStorage.projectFolderPath;
      console.debug('last project loaded from session storage');
    }

    vm.showAModal = function() {
      ngDialog.open({
        template: 'app/components/yesnoModal/yesnoModalTemplate.html',
        controller: 'yesnoModalController',
        controllerAs: 'yesnoModalCtrl',
        scope: $scope
      });
    };

    vm.showProjectSelectModal = function() {
      ngDialog.open({
        template:
          'app/components/projectFolderModal/projectFolderModalTemplate.html',
        controller: 'projectFolderModalController',
        controllerAs: 'projectFolderModalCtrl',
        className: 'ngdialog-theme-default',
        scope: $scope,
        data: {
          userHomeDirectoryPath: vm.userHomeDirectoryPath
        }
      }).closePromise.then(function(selectedProjectFolderPath) {
        if (!vm.isModalCancel(selectedProjectFolderPath.value)) {
          vm.projectFolderPath = selectedProjectFolderPath.value;
          sessionStorage.projectFolderPath = vm.projectFolderPath;
          console.debug('project path saved to session storage');
          vm.settings.recentlyOpen.push(vm.projectFolderPath);
        }
      });
    };

    vm.isModalCancel = function(closeValue) {
      return (angular.isNumber(closeValue) && closeValue === 0)
              || (angular.isString(closeValue)
                && (closeValue === '$document'
                  || closeValue === '$closeButton'));
    };

    // show the default projects directory to choose a folder from
    vm.openProject = function() {
      $http.get('/api/userHomeDirectory/')
              .then(function(res) {
                vm.userHomeDirectoryPath = res.data;
                vm.showProjectSelectModal();
              });
    };
  }]);
