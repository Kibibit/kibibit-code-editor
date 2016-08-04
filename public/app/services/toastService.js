angular.module('kibibitCodeEditor')

.service('ToastService', ['$mdToast', function($mdToast) {

  var vm = this;

  vm.showSimpleToast = showSimpleToast;

  ////////////

  function showSimpleToast(type, text) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .position('bottom right')
        .theme(type ? type : '')
        .hideDelay(3000)
    );
  }
}]);
