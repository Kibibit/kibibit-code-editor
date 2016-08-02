angular.module('kibibitCodeEditor')

.controller('mainController', [
  '$scope',
  '$http',
  'ngDialog',
  'SettingsService',
  'SessionStorageService',
  'ProjectService',
  function(
    $scope,
    $http,
    ngDialog,
    SettingsService,
    SessionStorageService,
    ProjectService) {

    var vm = this;

    window.mainCtrl = vm;

    vm.openFile = '';
    vm.openProject = {};
    vm.isSidebarOpen = false; // for mobile view

    vm.settings = SettingsService.settings;
    vm.projectService = ProjectService;

    if (SessionStorageService.projectFolderPath) {
      vm.projectFolderPath = sessionStorage.projectFolderPath;
      console.debug('last project loaded from session storage');
    }

    if (SessionStorageService.openFile) {
      vm.openFile = sessionStorage.openFile;
      console.debug('last file loaded from session storage');
    }

    if (SessionStorageService.projectLogoUrl) {
      vm.projectLogoUrl = SessionStorageService.projectLogoUrl;
      console.debug('last project logo loaded from session storage');
    }

    if (SessionStorageService.projectName) {
      vm.projectName = SessionStorageService.projectName;
      console.debug('last project name loaded from session storage');
    }

    $scope.$watch(function() {
      return vm.openFile;
    }, function(newVal) {
      SessionStorageService.openFile = newVal;
      console.debug('last file saved to session storage');
    });

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
          vm.projectName = getFolderNameFromPath(vm.projectFolderPath);

          SessionStorageService.projectName = vm.projectName;
          SessionStorageService.projectFolderPath = vm.projectFolderPath;
          console.debug('project path saved to session storage');
          vm.settings.recentlyOpen.push(vm.projectFolderPath);
          if (vm.openFile !== '') {
            vm.openFile = '';
          }

          ProjectService.getProjectLogo(vm.projectFolderPath)
            .then(function(res) {
              vm.projectLogoUrl = encodeURIComponent(res.logoPath);
              SessionStorageService.projectLogoUrl = vm.projectLogoUrl;
            }, function(error) {
              console.debug('no logo for this project');
              vm.projectLogoUrl = undefined;
              ProjectService.setTheme(undefined);
              SessionStorageService.removeItem('projectLogoUrl');
              SessionStorageService.removeItem('theme');
            });
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

    vm.emptyEditor = function() {
      vm.projectFolderPath = '';
      vm.projectName = undefined;
      vm.openFile = '';
      vm.projectLogoUrl = undefined;
      ProjectService.setTheme(undefined);
      SessionStorageService.removeItem('theme');
      SessionStorageService.removeItem('projectFolderPath');
      SessionStorageService.removeItem('projectLogoUrl');
      SessionStorageService.removeItem('projectName');
    };

    function getFolderNameFromPath(path) {
      if (!path) {
        return '';
      }

      return path.split(/\/|\\/).reverse()[0];
    }
  }]);
