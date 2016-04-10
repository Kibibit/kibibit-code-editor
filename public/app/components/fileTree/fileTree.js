angular.module('kibibitCodeEditor')

.directive('kbFileTree', function() {
  return {
    scope: {},
    bindToController: {
      path: '=kbFileTreePath',
      selection: '=kbFileTreeSelection',
      userOptions: '=kbFileTreeOptions'
    },
    controller: 'fileTreeController',
    controllerAs: 'fileTreeCtrl',
    templateUrl: 'app/components/fileTree/fileTreeTemplate.html',
    link: function(scope, element, attrs, fileTreeCtrl) {
      scope.$watch('fileTreeCtrl.path', function() {
        fileTreeCtrl.updateTreePath(fileTreeCtrl.path);
      });
    }
  };
})

.controller('fileTreeController', [
  'FolderService',
  function(
    FolderService) {

    var vm = this;

    vm.userOptions = vm.userOptions || {};

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

    // Handle the updated treePath 
    vm.updateTreePath = function(path) {
      if (typeof path === 'string' || path instanceof String) {
        FolderService.getFolder(path, function(folderContent) {
          vm.path = folderContent.data;
        });
        vm.expandedNodes = [];
      }
    }

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
          vm.selection = folder.path;
        }
      } else {
        file = treeNode;
        if (vm.options.selectionMode == 'file') {
          vm.selection =  file.path;
        }
      }
    };
  }]);

