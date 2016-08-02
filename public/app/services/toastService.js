angular.module('kibibitCodeEditor')

.service('ToastService', ['$mdToast', '$q', function($mdToast, $q) {
  var vm = this;

  vm.showActionToast = showActionToast;
  vm.showSimpleToast = showSimpleToast;

  function showActionToast(params) {
    if (!params || !params.text || !params.action) {
      return $q.reject({
        errno: 1,
        message: 'missing params'
      });
    }

    var toast = $mdToast.simple()
      .textContent(params.text)
      .action(params.action)
      .highlightAction(true)
      .position('bottom right');

    return $mdToast.show(toast);
  }

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
