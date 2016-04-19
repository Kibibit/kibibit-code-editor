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

    vm.openFiles = {};

    // parameters that we want additional things to happen each time they're being set or read.
    vm.watchedVariables = new WatchedVariables();

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

    vm.goFullscreen = function() {

      if (Fullscreen.isEnabled()) {
        Fullscreen.cancel();
      } else {
        Fullscreen.all();
      }
    };

    /* Contains all the watched variables. each variable should have a setter and getter. Those are how we bind extra functions to these variables */
    function WatchedVariables(){
      var openFile = '';

      this.__defineGetter__('openFile', function(){
        return openFile;
      });

      this.__defineSetter__('openFile', function(val){
        //console.debug('file clicked. need to open new tab, or highlight correct tab');
        if (!(val in vm.openFiles)) {
          console.debug('new file selected. creating new tab');
          vm.openFiles[val] = true;
        } else {
          console.debug('file is already opened. highlighting correct tab');
        }

        openFile = val;
      });
    }
  }]);
