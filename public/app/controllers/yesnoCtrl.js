var app = angular.module('userApp');

app.controller('YesNoController', ['$scope', 'close', function($scope, close) {

  $scope.close = close;

}]);