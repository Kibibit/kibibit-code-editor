angular.module('kibibitCodeEditor')

.directive('codeEditor', function() {
  return {
    scope: {},
    bindToController: {
      code: '='
    },
    controller: 'codeEditorController',
    controllerAs: 'codeEditorCtrl',
    templateUrl: 'app/components/codeEditor/codeEditorTemplate.html'
  };
})

.controller('codeEditorController', [
  '$timeout',
  'SettingsService',
  function(
    $timeout,
    SettingsService) {

    var vm = this;

    // initialize the editor session
    vm.aceLoaded = function(_editor) {
    vm.aceSession = _editor.getSession();
    // save cursor position
    _editor.on('changeSelection', function() {
      $timeout(function() {
        var cursor = _editor.selection.getCursor();
        cursor.row++;
        var settings = SettingsService.setSettings({
          cursor: cursor
        });
        console.debug('editor\'s cursor changed position:',
          settings.cursor);
      });
    });
  };
    // save the content of the editor on-change
    vm.aceChanged = function(_editor) {
    vm.aceDocumentValue = vm.aceSession.getDocument().getValue();
  };

  vm.editorOptions = {
    mode: 'javascript',
    theme: 'monokai',
    onLoad: vm.aceLoaded,
    onChange: vm.aceChanged
  };
}])

.directive('kbChangeAceScroll', function() {
  return {
    scope: false,
    link: function(scope, element, attrs) {
      var scrollbarY = element.parent().find('.ace_scrollbar.ace_scrollbar-v');
      var scrollbarX = element.parent().find('.ace_scrollbar.ace_scrollbar-h');
      scope.$watch(function() {
        return scrollbarY.find('.ace_scrollbar-inner').height();
      }, updateY);
      scope.$watch(function() {
        return scrollbarX.find('.ace_scrollbar-inner').width();
      }, updateX);
      scope.config = {
        scrollButtons: {
          scrollAmount: 'auto', // scroll amount when button pressed
          enable: false // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        axis: 'yx', // enable 2 axis scrollbars by default,
        theme: 'minimal',
        autoHideScrollbar: true
      };
      function updateY(newVal, oldVal) {
        console.log('update scroll Y');
      }

      function updateX(newVal, oldVal) {
        console.log('update scroll X');
      }
    }
  };
});
