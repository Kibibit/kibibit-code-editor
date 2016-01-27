angular.module('kibibitCodeEditor')

.controller('projectFolderModalController', function(FolderService) {

  var vm = this;

  // get file from the server and update the ace session content
  vm.onSelection = function(node) {
    if (node.type == 'directory') {
      FolderService.getFolder(node.path, function(res) {
        node.children = res.data.children;
      });
      vm.expandedNodes.push(node);
      return true;
    } else {
      return false;
    }
  };

});
