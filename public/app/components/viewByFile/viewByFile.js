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
  'DraftsService',
  function(
    FileService,
    DraftsService) {

    var vm = this;

    vm.updateFileContent = updateFileContent;

    ////////////

    function analyzeFile(fileInfo) {
      vm.fileInfo = fileInfo.data;
      vm.fileType = getFileTypeFromMimeType(vm.fileInfo.mimeType);
      vm.imageUri = vm.fileType === 'image' ?
        vm.fileInfo.content : undefined;
    }

    function getFileTypeFromMimeType(mimeType) {
      if (mimeType.indexOf('image') !== -1) {
        return 'image';
      } else if (mimeType.indexOf('font') !== -1) {
        return 'font';
      } else {
        return 'code';
      }
    }

    function updateFileContent(filePath) {
      DraftsService.getDraft(filePath).then(
        function success(fileInfo) {
          analyzeFile(fileInfo);
        },
        function fail() {
          if (filePath !== '') {
            FileService.getFile(filePath, function(fileInfo) {
              if (fileInfo.data.errno) {
                vm.fileType = 'error';
              } else {
                analyzeFile(fileInfo);
              }
            });
          } else {
            vm.fileType = 'code';
            vm.fileInfo = undefined;
          }
        }
      );
    }
  }
]);
