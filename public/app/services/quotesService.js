angular.module('kibibitCodeEditor')

.service('QuotesService', ['$http', '$q', function($http, $q) {

  var vm = this;

  vm.getQuotes = getQuotes;

  ////////////

  function getQuotes(numberOfQuotes) {
    var deferred = $q.defer();

    $http.get('/api/quotes/' + (numberOfQuotes || '')).then(function(res) {
      if (angular.isNumber(res.errno)) {
        console.error(res.errno);
        deferred.reject(res);
      } else {
        deferred.resolve(res.data);
      }
    }, function(httpError) {
      deferred.reject(httpError);
    });

    return deferred.promise;
  }

}]);
