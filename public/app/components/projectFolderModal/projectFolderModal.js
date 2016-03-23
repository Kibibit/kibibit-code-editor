angular.module('kibibitCodeEditor')

.controller('projectFolderModalController',[
  '$rootScope',
  'FolderService',
   function(
    $rootScope,
    FolderService) {

     var vm = this;

     vm.setCurrentFolder = function(node) {
    vm.currentFolder = node.path;
  };

     // open the chosen project folder
     vm.openFolder = function() {
    vm.code = null;
    vm.projectFolder = false;
    console.log(vm.currentFolder);
    FolderService.getFolder(vm.currentFolder, function(res) {
      vm.workFolder = res.data;
      console.log('got res: ' + res);
      $rootScope.$emit('workFolderSelected', vm.workFolder);
    });
    return true;
  };

   }]);
