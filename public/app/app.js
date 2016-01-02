angular.module('kibibitCodeEditor',
	['angular-loading-bar',
	'ngAnimate',
	'app.routes',
	'treeControl',
	'ui.ace',
	'angularResizable',
	'angularModalService',
	])
.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);