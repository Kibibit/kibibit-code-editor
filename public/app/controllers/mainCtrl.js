angular.module('mainCtrl', ['ui.ace'])

.controller('mainController', function($rootScope, $scope, $location, Auth, $http) {

    var vm = this;

    $rootScope.chooseFolder = 'Choose Folder';

    $rootScope.editorOptions = {
        mode: 'javascript',
        theme: 'monokai'
    };

    // initialize the editor session
    $scope.aceLoaded = function(_editor) {
        $scope.aceSession = _editor.getSession();
    };
    // save the content of the editor on-change
    $scope.aceChanged = function() {
        $scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
    };

    vm.openFile = function(node) {
        $http.get('/api/file/' + encodeURIComponent('/Development/' + node.path))
            .then(function(res) {
                console.log(res.errno);
                if (res.errno !== null) {
                    $scope.aceSession.setValue(res.data);
                }
            })
    }

    vm.openFolder = function() {
        $rootScope.chooseFolder = 'Working...'
        $http.get('/api/directory/' + encodeURIComponent('/Development'))
            .then(function(res) {
                console.log(res.errno);
                if (res.errno !== null) {
                    $rootScope.folder = res.data;
                    $rootScope.chooseFolder = 'Choose Folder'
                    console.log('got res');
                }
            });
    }



    $rootScope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: false
    };

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();

        // get user information on page load
        Auth.getUser()
            .then(function(data) {
                vm.user = data.data;
            });
    });

    // function to handle login form
    vm.doLogin = function() {
        vm.processing = true;

        // clear the error
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {
                vm.processing = false;

                // if a user successfully logs in, redirect to users page
                if (data.success)
                    $location.path('/users');
                else
                    vm.error = data.message;

            });
    };


    // function to handle logging out
    vm.doLogout = function() {
        Auth.logout();
        vm.user = '';

        $location.path('/login');
    };

    vm.createSample = function() {
        Auth.createSampleUser();
    };
});
