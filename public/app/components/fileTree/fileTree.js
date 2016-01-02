angular.module('kibibitCodeEditor')

.directive('fileTree', function() {
  return {
    scope: {},
    bindToController: {
      treeFolder: '=',
      selectionAction: '='
    },
    controller: 'fileTreeController',
    controllerAs: 'fileTreeCtrl',
    templateUrl: 'app/components/fileTree/fileTreeTemplate.html'
  };
})

.controller('fileTreeController', function() {
  var vm = this;

  vm.treeOptions = {
    nodeChildren: 'children',
    dirSelectable: false
  };


  // get array of functions to initiate when selecting tree
  vm.performSelectionActions = function(node) {
    if (angular.isArray(vm.selectionAction)) {
      for (i = 0; i < vm.selectionAction.length; i++) {
        vm.selectionAction[i](node);
      }
    }
  }


});