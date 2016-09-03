angular.module('kibibitCodeEditor')

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
