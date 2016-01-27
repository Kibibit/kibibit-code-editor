angular.module('kibibitCodeEditor')

.controller('mainController',
  function($scope, $http, ngDialog, FileService, FolderService) {

    var vm = this;

    // Init
    vm.code = '';

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

    // get file from the server and update the ace session content
    vm.onSelection = function(node) {
      if (node.type == 'directory') {
        FolderService.getFolder(node.path, function(res) {
          node.children = res.data.children;
        });
        vm.expandedNodes.push(node);
      } else {
        FileService.getFile(node.path, function(res) {
          vm.code = res.data;
        });
      }
    };

    vm.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: false
    };
  });
