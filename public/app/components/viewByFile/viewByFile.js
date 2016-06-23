angular.module('kibibitCodeEditor')

.directive('kbViewByFile', function() {
  return {
    scope: {},
    bindToController: {
      openFile: '=kbOpenFile'
    },
    controller: 'viewByFileController',
    controllerAs: 'viewByFileCtrl',
    templateUrl: 'app/components/viewByFile/viewByFileTemplate.html',
    link: function(scope, element, attrs, viewByFileCtrl) {
      scope.$watch('viewByFileCtrl.openFile', function(newOpenFile) {
        viewByFileCtrl.updateFileContent(newOpenFile);
      });
    }
  };
})

.controller('viewByFileController', [
  'FileService',
  function(FileService) {
    var vm = this;

    vm.updateFileContent = function(filePath) {
      if (filePath !== '') {
        FileService.getFile(filePath, function(fileInfo) {
          vm.fileInfo = fileInfo.data;
          vm.fileType = getFileTypeFromMimeType(vm.fileInfo.mimeType);
          vm.imageUri = vm.fileType === "image" ? vm.fileInfo.content : undefined;
        });
      }
    };

    function getFileTypeFromMimeType(mimeType) {
      if (mimeType.indexOf('image') !== -1) {
        return "image";
      } else {
        return "code";
      }
    }

  }
]);
