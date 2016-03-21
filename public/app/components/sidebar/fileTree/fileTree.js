angular.module('kibibitCodeEditor')

.directive('fileTree', function() {
  return {
    // scope: {},
    bindToController: {
      path: '='
    },
    controller: 'fileTreeController',
    controllerAs: 'fileTreeCtrl',
    templateUrl: 'app/components/sidebar/fileTree/fileTreeTemplate.html'
  };
})

.controller('fileTreeController', [
  'FolderService', 
  'FileService', 
  function(
    FolderService, 
    FileService) {
    
    var vm = this;
    console.log('vm.path: ', vm.path);

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
          vm.code = res.data;
        });
      }
    };  


}]);