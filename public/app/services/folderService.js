angular.module('kibibitCodeEditor')

.service('FolderService', ['$http', function($http) {

  var vm = this;

  vm.getFolder = getFolder;

  ////////////

  function getFolder(folderToGet, callback) {
    $http.get('/api/directory/' + encodeURIComponent(folderToGet))
      .then(function(res) {
        if (res.errno) {
          console.error(res.errno);
        }
        if (res.errno !== null && angular.isFunction(callback)) {
          callback(res);
        }
      });
  }

}]);
