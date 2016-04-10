angular.module('kibibitCodeEditor')

.controller('mainController', [
  '$scope',
  '$http',
  'ngDialog',
  'Fullscreen',
  'SettingsService',
  function(
    $scope,
    $http,
    ngDialog,
    Fullscreen,
    SettingsService) {

    var vm = this;

    vm.openFile = '';

    vm.settings = SettingsService.getSettings();

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
        }
      });
    };

    vm.isModalCancel = function(closeValue) {
      return angular.isNumber(closeValue) && closeValue === 0;
    };

    // show the default projects directory to choose a folder from
    vm.openProject = function() {
      $http.get('/api/userHomeDirectory/')
              .then(function(res) {
                vm.userHomeDirectoryPath = res.data;
                vm.showProjectSelectModal();
              });
    };

    vm.goFullscreen = function() {

      if (Fullscreen.isEnabled()) {
        Fullscreen.cancel();
      } else {
        Fullscreen.all();
      }
    };
  }]);
