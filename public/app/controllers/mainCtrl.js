angular.module('kibibitCodeEditor')

.controller('mainController', [
  '$scope',
  '$http',
  'ngDialog',
  'SettingsService',
  'SessionStorageService',
  function(
    $scope,
    $http,
    ngDialog,
    SettingsService,
    SessionStorageService) {

    var vm = this;

    window.mainCtrl = vm; // for debugging

    vm.emptyEditor = emptyEditor;
    vm.isModalCancel = isModalCancel;
    vm.isSidebarOpen = false; // for mobile view
    vm.openFile = '';
    vm.openProject = openProject;
    vm.saveCurrentEditor = saveCurrentEditor;
    vm.settings = SettingsService.settings;
    vm.showProjectSelectModal = showProjectSelectModal;

    init();

    ////////////

    function emptyEditor() {
      vm.projectFolderPath = '';
      vm.projectName = undefined;
      vm.openFile = '';
      SessionStorageService.removeItem('projectFolderPath');
      SessionStorageService.removeItem('projectName');
    }

    function getFolderNameFromPath(path) {
      if (!path) {
        return '';
      }

      return path.split(/\/|\\/).reverse()[0];
    }

    function init() {
      if (SessionStorageService.projectFolderPath) {
        vm.projectFolderPath = sessionStorage.projectFolderPath;
        console.debug('last project loaded from session storage');
      }

      if (SessionStorageService.openFile) {
        vm.openFile = sessionStorage.openFile;
        console.debug('last file loaded from session storage');
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
    }

    function isModalCancel(closeValue) {
      return (angular.isNumber(closeValue) && closeValue === 0)
              || (angular.isString(closeValue)
                && (closeValue === '$document'
                  || closeValue === '$closeButton'));
    }

    function openProject() {
      $http.get('/api/userHomeDirectory/')
        .then(function(res) {
          vm.userHomeDirectoryPath = res.data;
          vm.showProjectSelectModal();
        });
    }
    
    function saveAsModal() {
      ngDialog.open({
        template:
          'app/components/saveAsModal/saveAsModalTemplate.html',
        controller: 'saveAsModalController',
        controllerAs: 'saveAsModalCtrl',
        className: 'ngdialog-theme-default',
        scope: $scope,
        data: {
          savePath: vm.projectFolderPath || vm.userHomeDirectoryPath
        }
      }).closePromise.then();
    }

    function saveCurrentEditor(openFilePath) {
      var currentEditor = vm.settings.currentEditor;
      if (currentEditor && openFilePath) {
        FileService.saveFile(openFilePath,
          currentEditor.getSession().getDocument().getValue(),
          function() {
            ToastService.showSimpleToast('success-toast',
              'File successfully saved');
          }
        );
      } else if (currentEditor) {
        // open the modal shit
      }
    }

    function setOpenProject(selectedProjectFolderPath) {
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
      }
    }

    function showProjectSelectModal() {
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
      }).closePromise.then(setOpenProject);
    }
    
  }]);
