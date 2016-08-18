angular.module('kibibitCodeEditor')

.directive('kbUserControls', function() {
  return {
    scope: {},
    bindToController: {
      userData: '=kbUserData'
    },
    controller: 'userControlsController',
    controllerAs: 'userControlsCtrl',
    templateUrl: 'app/components/userControls/userControlsTemplate.html'
  };
})

.controller('userControlsController', [
  'QuotesService',
  function(QuotesService) {
    var vm = this;

    
  }
]);
