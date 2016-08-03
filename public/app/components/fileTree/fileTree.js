angular.module('kibibitCodeEditor')

.directive('kbFileTree', function() {
  return {
    scope: {},
    bindToController: {
      path: '=kbFileTreePath',
      selection: '=kbFileTreeSelection',
      userOptions: '=kbFileTreeOptions',
      onFileSelection: '&kbOnFileSelection'
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
  'deviceDetector',
  function(
    FolderService,
    deviceDetector) {

    var vm = this;

    vm.browserClass =
      deviceDetector.raw.browser.firefox ? 'firefox' : undefined;
    vm.onSelection = onSelection;
    vm.options = {
      selectionMode: 'file',
      theme: 'tree-dark'
    };
    vm.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: true,
      isLeaf: function(node) {
        return node.type !== 'directory';
      }
    };
    vm.updateTreePath = updateTreePath;
    

    angular.extend(vm.options, vm.userOptions || {});

    ////////////

    // Handle the updated treePath
    function updateTreePath(path) {
      if (typeof path === 'string' || path instanceof String) {
        FolderService.getFolder(path, function(folderContent) {
          vm.folderContent = folderContent.data;
        });
        vm.expandedNodes = [];
      }
    }

    // get file from the server and update the ace session content
    function onSelection(treeNode) {
      var file;
      var folder;
      if (treeNode.type == 'directory') {
        folder = treeNode;
        var folderIndex = vm.expandedNodes.indexOf(folder);
        var isFolderOpen = folderIndex > -1;

        if (isFolderOpen) {
          closeFolder(folder);
        } else {
          FolderService.getFolder(folder.path, function(folderContent) {
            folder.children = folderContent.data.children;
          });
          vm.expandedNodes.push(folder);
        }

        if (vm.options.selectionMode == 'folder') {
          vm.selection = folder.path;
          vm.onFileSelection();
        }
      } else {
        file = treeNode;
        if (vm.options.selectionMode == 'file') {
          vm.selection =  file.path;
          vm.onFileSelection();
        }
      }
    }

    function closeFolder(folder) {
      vm.expandedNodes = vm.expandedNodes.filter(function(node) {
        return !node.path.startsWith(folder.path);
      });
    }

  }]);

