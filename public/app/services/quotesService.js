angular.module('kibibitCodeEditor')

.service('QuotesService', ['$http', '$q', function($http, $q) {
  var vm = this;

  vm.getQuotes = function(numberOfQuotes) {
    var quotesPromise = $http.get('/api/quotes/' + (numberOfQuotes || ''));
    quotesPromise.then(function(res) {
      if (angular.isNumber(res.errno)) {
        console.error(res.errno);
      }
    });

    return quotesPromise;
  };

}]);
