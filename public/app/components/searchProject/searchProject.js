angular.module('kibibitCodeEditor')

.directive('kbSearchProject', function() {
  return {
    scope: {},
    bindToController: {
      searchTerm: '=ngModel'
    },
    controller: 'searchProjectController',
    controllerAs: 'searchProjectCtrl',
    templateUrl: 'app/components/searchProject/searchProjectTemplate.html',
    link: function(scope, element, attrs, searchProjectCtrl) {
      var searchBtn = angular.element('.search-btn');
      var input = angular.element('.search-input');

      /* OPEN SEARCH */
      searchBtn.click(openSearch);

      /* BLUR ON ESC */
      input.keyup(function(e) {
        if (e.keyCode == 27) {
          input.blur();
        }
      });

      /* CHANGE CLASSES ON FOCUS\BLUR */
      input.focus(function() {
        input.addClass('open');
        searchBtn.addClass('open');
        input.removeClass('blurred');
      });

      input.blur(function() {
        if (input.val() === '') {
          input.removeClass('open');
          searchBtn.removeClass('open');
        }
        input.addClass('blurred');
      });

      function openSearch() {
        if (!input.hasClass('open')) {
          input.focus();
        }
      }
    }
  };
})

.controller('searchProjectController', [
  function() {
    var vm = this;
  }
]);
