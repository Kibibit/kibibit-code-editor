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
	'ui.layout',
	'ngScrollbars'])
.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}])
.config(['ScrollBarsProvider', function (ScrollBarsProvider) {
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
}]);
