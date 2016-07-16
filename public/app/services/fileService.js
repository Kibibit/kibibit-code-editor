angular.module('kibibitCodeEditor')

.service('FileService', ['$http', function($http) {
  var vm = this;

  vm.getFile = function(folderToGet, callback) {
    $http.get('/api/file/' + encodeURIComponent(folderToGet))
      .then(function(res) {
        if (res.errno !== null) {
          console.log(res.errno);
        }

        if (angular.isFunction(callback)) {
          callback(res);
        }
      });
  };

  vm.saveFile = function(fileFullpath, newFileContent, callback) {
    var data = {
      newContent: newFileContent
    };
    $http.put('/api/file/' + encodeURIComponent(fileFullpath) + '/true', data)
      .then(function(res) {
        console.log(res.errno);
        if (res.errno !== null && angular.isFunction(callback)) {
          callback(res);
        }
      });
  };
}]);
