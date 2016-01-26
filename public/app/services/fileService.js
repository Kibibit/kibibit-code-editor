angular.module('kibibitCodeEditor')

.service('FileService', ['$http', function($http) {
  var vm = this;

  vm.getFile = function(folderToGet, callback) {
    $http.get('/api/file/' + encodeURIComponent(folderToGet))
                .then(function(res) {
                  console.log(res.errno);
                  if (res.errno !== null && angular.isFunction(callback)) {
                    callback(res);
                  }
                });
  };
}]);
