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

    // Listen to work folder selection event and update the sidebar tree
    $rootScope.$on('workFolderSelected', function(event, workFolder) {
      vm.workFolder = workFolder;  
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
        scope: $scope,
        data: {userHomeDirectory: vm.userHomeDirectory}
      });
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
                  vm.projectFolder = true;
                  vm.showProjectSelectModal();
                });                           
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
