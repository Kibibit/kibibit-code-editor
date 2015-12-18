angular.module('userApp')

.controller('yesnoModalController', ['close', function(close) {

	var yesnoModalCtrl = this;

	yesnoModalCtrl.close = close;

}]);