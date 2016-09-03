angular.module('kibibitCodeEditor')

.service('DraftsService', [
  '$q',
  'SessionStorageService',
  function(
    $q,
    SessionStorageService) {

    var vm = this;

    vm.draftsObject = {};

    init();

    vm.deleteDraft = function(filePath) {
      var objectKey = 'draft-' + filePath;
      vm.draftsObject[objectKey] = undefined;
      SessionStorageService.removeItem(objectKey);
    };

    vm.getDraft = function(filePath) {
      var requestedFile = vm.draftsObject[filePath];
      if (requestedFile) {
        return $q.when(JSON.parse(requestedFile));
      }
      else {
        return $q.reject('requested file is not in sessionStorage');
      }
    };

    vm.saveDraft = function(fileObject) {
      var fileObjectKey = 'draft-' + fileObject.path;

      fileObject.lastModified = new Date().getTime();

      vm.draftsObject[fileObjectKey] = fileObject;
      SessionStorageService[fileObjectKey] = JSON.stringify(fileObject);
    };

    function init() {
      var sessionStorage = SessionStorageService;
      var sessionStorageKeys = Object.keys(sessionStorage);

      sessionStorageKeys.forEach(function checkIfDraft(key) {
        if (key.startsWith('draft-')) {
          var slicedKey = key.replace('draft-', '');
          vm.draftsObject[slicedKey] = sessionStorage[key];
        }
      });
    }
}]);
