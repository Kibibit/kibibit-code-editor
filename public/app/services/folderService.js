angular.module('kibibitCodeEditor')

.service('FolderService', ['$http', function($http) {
  var vm = this;

  vm.getFolder = function(folderToGet, callback) {
    $http.get('/api/directory/' + encodeURIComponent(folderToGet))
                .then(function(res) {
                  console.log(res.errno);
                  if (res.errno !== null && angular.isFunction(callback)) {
                    callback(res);
                  }
                });
  };
}]);
