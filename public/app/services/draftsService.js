angular.module('kibibitCodeEditor')

.service('DraftsService', [
  '$q',
  'SessionStorageService',
  function(
    $q,
    SessionStorageService) {
    var vm = this;

    var DRAFT_PREFIX = 'draft-';

    vm.draftsObject = {};

    init();

    vm.deleteDraft = function(filePath) {
      var objectKey = DRAFT_PREFIX + filePath;
      vm.draftsObject[objectKey] = undefined;
      SessionStorageService.removeItem(objectKey);
    };

    vm.getDraft = function(filePath) {
      var requestedFile = vm.draftsObject[filePath];
      if (requestedFile) {
        return $q.when(requestedFile);
      }
      else {
        return $q.reject('requested file is not in sessionStorage');
      }
    };

    ////////////

    vm.saveDraft = function(fileObject) {
      var fileObjectKey = DRAFT_PREFIX + fileObject.path;

      fileObject.lastModified = new Date().getTime();

      vm.draftsObject[fileObject.path] = fileObject;
      SessionStorageService[fileObjectKey] = JSON.stringify(fileObject);
    };

    function init() {
      var sessionStorage = SessionStorageService;
      var sessionStorageKeys = Object.keys(sessionStorage);

      sessionStorageKeys.forEach(function checkIfDraft(key) {
        if (key.startsWith(DRAFT_PREFIX)) {
          var slicedKey = key.replace(DRAFT_PREFIX, '');
          vm.draftsObject[slicedKey] = JSON.parse(sessionStorage[key]);
        }
      });
    }
}]);
