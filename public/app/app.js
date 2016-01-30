angular.module('kibibitCodeEditor',
	['angular-loading-bar',
	'ngAnimate',
	'app.routes',
	'treeControl',
	'ui.ace',
	'angularResizable',
	'ngDialog',
	'ngMaterial',
	'FBAngular'])
.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
