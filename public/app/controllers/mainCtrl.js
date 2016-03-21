angular.module('kibibitCodeEditor')

.controller('mainController', [
  '$scope',
  '$rootScope',
  '$http',
  'ngDialog',
  'FolderService',
  'Fullscreen',
  'SettingsService',
  function(
    $scope,
    $rootScope,
    $http,
    ngDialog,
    FolderService,
    Fullscreen,
    SettingsService) {

    var vm = this;


    // Listen to file selection event and updates the code editor
    $rootScope.$on('fileSelected', function(event, file) {
      vm.code = file;
    })

    // Init
    vm.code = '';

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
        scope: $scope
      });
    };

    vm.currentFolder = '';

    // binds the selected tree folder to a variable
    vm.setCurrentFolder = function(node) {
      vm.currentFolder = node.path;
    };

    // show the default projects directory to choose a folder from
    vm.openProject = function() {
      $http.get('/api/userHomeDirectory/')
              .then(function(res) {
                userHomeDirectory = res.data;
                FolderService.getFolder(userHomeDirectory, function(res) {
                  vm.userHomeDirectory = res.data;
                  console.info('using the following user folder: ' +
                    res.data.path);
                });
                vm.projectFolder = true;
                vm.showProjectSelectModal();
              });
    };

    // open the chosen project folder
    vm.openFolder = function() {
      vm.code = null;
      vm.projectFolder = false;
      console.log(vm.currentFolder);
      FolderService.getFolder(vm.currentFolder, function(res) {
        vm.workFolder = res.data;
        console.log('got res: ' + res);
      });
      return true;
    };

    vm.goFullscreen = function() {

      if (Fullscreen.isEnabled()) {
        Fullscreen.cancel();
      } else {
        Fullscreen.all();
      }
    };
  }]);
