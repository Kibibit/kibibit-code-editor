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
}])

.constant('CODE_EDITOR', {
  'MODE_LIST': ace.require('ace/ext/modelist'),
  'THEME_LIST': ace.require('ace/ext/themelist')
})
  
.constant('DRAFTS', {
  'DRAFT_PREFIX' : 'draft-'
})  
  
.constant('ERROR_MSGS', {
  'TYPE_ERROR': function(varName, typeExpected, typeRecieved) {
    return [
      varName,
      ' should be a ',
      typeExpected,
      ' but was given a ',
      typeRecieved].join('');
  },
  'MATCH_ERROR': function(varName, collectionName) {
    return [
      varName,
      'value should exist in ',
      collectionName].join('');
  }
});
