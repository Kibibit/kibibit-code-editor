angular.module('kibibitCodeEditor')

.directive('kbFileTree', function() {
  return {
    scope: {},
    bindToController: {
      path: '=kbFileTreePath',
      kbFileTreeSelection: '=',
      kbFileTreeOptions: '='
    },
    controller: 'fileTreeController',
    controllerAs: 'fileTreeCtrl',
    templateUrl: 'app/components/fileTree/fileTreeTemplate.html'
  };
})

.controller('fileTreeController', [
  'FolderService',
  'EventManagerService',
  function(
    FolderService,
    EventManagerService) {

    var vm = this;

    vm.getFolder = function(path) {
      if (path) {
        FolderService.getFolder(path, function(folderContent) {
          vm.path = folderContent.data;
        });
      }
    };

    vm.getFolder(vm.path);

    // Listen to change folder update events
    EventManagerService.on('fileTreePathUpdated', vm.getFolder);

    vm.userOptions = vm.kbFileTreeOptions || {};

    vm.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: true,
      isLeaf: function(node) {
        return node.type !== 'directory';
      }
    };

    vm.options = {
      selectionMode: 'file',
      theme: 'tree-dark'
    };

    angular.extend(vm.options, vm.userOptions);

    // get file from the server and update the ace session content
    vm.onSelection = function(treeNode) {
      var file;
      var folder;
      if (treeNode.type == 'directory') {
        folder = treeNode;
        var directoryIndex = vm.expandedNodes.indexOf(folder);
        var isDirectoryOpen = directoryIndex > -1;
        if (isDirectoryOpen) {
          // contract directory
          vm.expandedNodes.splice(directoryIndex, 1);
        } else {
          FolderService.getFolder(folder.path, function(folderContent) {
            folder.children = folderContent.data.children;
          });
          vm.expandedNodes.push(folder);
        }
        if (vm.options.selectionMode == 'folder') {
          vm.kbFileTreeSelection = folder.path;
        }
      } else {
        file = treeNode;
        if (vm.options.selectionMode == 'file') {
          vm.kbFileTreeSelection =  file.path;
        }
      }
    };
  }]);

