angular.module('kibibitCodeEditor',
	['angular-loading-bar',
	'ngAnimate',
	'app.routes',
	'treeControl',
	'ui.ace',
	'angularResizable',
	'ngDialog',
	'ngMaterial',
	'FBAngular',
	'ui.layout'])
.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
