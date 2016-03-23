angular.module('kibibitCodeEditor')

.directive('fileTree', function() {
  return {
    // scope: {},
    bindToController: {
      path: '=',
      containerClass: '=',
      treeClass: '=',
      selectionCallback: '='
    },
    controller: 'fileTreeController',
    controllerAs: 'fileTreeCtrl',
    templateUrl: 'app/components/fileTree/fileTreeTemplate.html'
  };
})

.controller('fileTreeController', [
  '$rootScope',
  'FolderService', 
  'FileService', 
  function(
    $rootScope,
    FolderService, 
    FileService) {
    
    var vm = this;

    vm.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: true,
      isLeaf: function(node) {
        return node.type !== 'directory';
      }
    };

    // get file from the server and update the ace session content
    vm.onSelection = function(node) {
      if (node.type == 'directory') {
        // Execute additional selection function if defined
        if (typeof(vm.selectionCallback) == 'function') {
          vm.selectionCallback(node);
        }        
        var nodeIndex = vm.expandedNodes.indexOf(node);
        if (nodeIndex > -1) {
          vm.expandedNodes.splice(nodeIndex, 1);
        } else {
          FolderService.getFolder(node.path, function(res) {
            node.children = res.data.children;
          });
          vm.expandedNodes.push(node);
        }
      } else {
        FileService.getFile(node.path, function(res) {
          $rootScope.$emit('fileSelected', res.data);
        });
      }
    };  


}]);
