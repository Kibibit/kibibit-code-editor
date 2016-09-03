angular.module('kibibitCodeEditor')

.service('DraftsService', [
  '$q',
  'DRAFTS',
  'SessionStorageService',
  function(
    $q,
    DRAFTS,
    SessionStorageService) {
    var vm = this;

    vm.draftsObject = {};

    vm.deleteDraft = deleteDraft;
    vm.getDraft = getDraft;
    vm.saveDraft = saveDraft;

    init();

    ////////////

    function deleteDraft(filePath) {
      var objectKey = DRAFTS.DRAFT_PREFIX + filePath;
      vm.draftsObject[objectKey] = undefined;
      SessionStorageService.removeItem(objectKey);
    }

    function getDraft(filePath) {
      var requestedFile = vm.draftsObject[filePath];
      if (requestedFile) {
        return $q.when(requestedFile);
      } else {
        return $q.reject('requested file is not in sessionStorage');
      }
    }

    function init() {
      var sessionStorage = SessionStorageService;
      var sessionStorageKeys = Object.keys(sessionStorage);

      sessionStorageKeys.forEach(function checkIfDraft(key) {
        if (key.startsWith(DRAFTS.DRAFT_PREFIX)) {
          var slicedKey = key.replace(DRAFTS.DRAFT_PREFIX, '');
          vm.draftsObject[slicedKey] = JSON.parse(sessionStorage[key]);
        }
      });
    }

    function saveDraft(fileObject) {
      var fileObjectKey = DRAFTS.DRAFT_PREFIX + fileObject.path;

      fileObject.lastModified = new Date().getTime();

      vm.draftsObject[fileObject.path] = fileObject;
      SessionStorageService[fileObjectKey] = JSON.stringify(fileObject);
    }
  }
]);
