angular.module('kibibitCodeEditor',
  ['angular-loading-bar',
  'ngAnimate',
  'app.routes',
  'treeControl',
  'ui.ace',
  'ngDialog',
  'ngMaterial',
  'FBAngular',
  'ui.layout',
  'ngScrollbars',
  'ngSanitize',
  'hc.marked',
  'emoji',
  'jsonFormatter',
  'ngclipboard',
  'ng.deviceDetector',
  'ngMdIcons'])

.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}])

.config(['ScrollBarsProvider', function(ScrollBarsProvider) {
  // the following settings are defined for all scrollbars unless the
  // scrollbar has local scope configuration
  ScrollBarsProvider.defaults = {
    scrollButtons: {
      scrollAmount: 'auto', // scroll amount when button pressed
      enable: false // enable scrolling buttons by default
    },
    scrollInertia: 400, // adjust however you want
    axis: 'yx', // enable 2 axis scrollbars by default,
    theme: 'minimal-dark',
    autoHideScrollbar: true
  };
}])

.run(function() {
  _.mixin({
    'first': function(array, n) {
      var element = _.take(array, n);
      return element.length <= 1 ? element[0] : element;
    },
    'last': function(array, n) {
      var element = _.takeRight(array, n);
      return element.length <= 1 ? element[0] : element;
    },
    'isPromise': function(value) {
      return value && _.isFunction(value.then);
    },
    'color': function(value) {
      return tinycolor(value);
    },
    'pluck': _.map,
    'where': _.filter,
    'findWhere': _.find
  });

  chance.mixin({
    'user': function() {
      return {
        name: chance.name(),
        email: chance.email(),
        newMessage: chance.bool(),
        avatar: chance.avatar({fileExtension: 'jpeg'}) + '?d=identicon'
      };
    },
    'file': function() {
      return {
        content: chance.unique(chance.paragraph, 10).join('\n'),
        mimeType: chance.string({pool: 'abcdefghijklmnop', length: 5}) + '/' + chance.string({pool: 'abcdefghijklmnop', length: 5}),
        path: chance.string({pool: 'abcdefghijklmnop', length: 5}) + '/' + chance.string({pool: 'abcdefghijklmnop', length: 5})
      };
    }
  });
})


.config(['markedProvider', function(markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function(code, lang) {
      if (lang) {
        try {
          return hljs.highlight(lang, code, true).value;
        } catch (e) {
          return hljs.highlightAuto(code).value;
        }
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
  });
}])

.filter('marked', ['marked', function(marked) {
  return function(input) {
    return marked(input || '');
  };
}]);
