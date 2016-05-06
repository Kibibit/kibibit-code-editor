angular.module('kibibitCodeEditor')

.directive('kbCodeEditor', function() {
  return {
    scope: {},
    bindToController: {
      openFile: '=kbOpenFile'
    },
    controller: 'codeEditorController',
    controllerAs: 'codeEditorCtrl',
    templateUrl: 'app/components/codeEditor/codeEditorTemplate.html',
    link: function(scope, element, attrs, codeEditorCtrl) {
      scope.$watch('codeEditorCtrl.openFile', function(newOpenFile) {
        codeEditorCtrl.updateFileContent(newOpenFile);
      });
    }
  };
})

.controller('codeEditorController', [
  '$timeout',
  'FileService',
  'SettingsService',
  function(
    $timeout,
    FileService,
    SettingsService) {

    var vm = this;

    // initialize the editor session
    vm.aceLoaded = function(_editor) {
      vm.aceSession = _editor.getSession();
      vm.undoManager = _editor.getSession().getUndoManager();
      SettingsService.settings.currentUndoManager = vm.undoManager;
      SettingsService.settings.currentEditor = _editor;
      // save cursor position
      _editor.on('changeSelection', function() {
        $timeout(function() {
          var cursor = _editor.selection.getCursor();
          cursor.row++;
          SettingsService.settings.cursor = cursor;
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

    vm.updateFileContent = function(filePath) {
      if (filePath !== '') {
        FileService.getFile(filePath, function(fileContent) {
          vm.code = fileContent.data;
        });
      }
    };
  }
])

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
