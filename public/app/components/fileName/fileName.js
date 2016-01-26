angular.module('kibibitCodeEditor')

.directive('fileName', function() {
  return {
    scope: {},
    bindToController: {
      file: '='
    },
    controller: 'fileNameController',
    controllerAs: 'fileNameCtrl',
    templateUrl: 'app/components/fileName/fileNameTemplate.html'
  };
})

.controller('fileNameController', function() {
  var vm = this;
});
