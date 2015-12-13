angular.module('mainCtrl', ['ui.ace', 'angularResizable'])

.controller('mainController', function($rootScope, $scope, $location, Auth, $http) {

    var vm = this;

    var tmp_path = '/home/thatkookooguy/Development';

    $rootScope.code = "alert('hello world');";

    $rootScope.editorOptions = {
        mode: 'javascript',
        theme: 'monokai'
    };

    // get file from the server and update the ace session content  
    vm.onSelection = function(node) {
        if (node.type == 'directory') {
            $http.get('/api/directory/' + encodeURIComponent(node.path))
                .then(function(res) {
                    console.log(res.errno);
                    if (res.errno !== null) {
                        node.children = res.data.children;
                    }
                });
            vm.expandedNodes.push(node);
        } else {
            // @ortichon: This is where your original openFile function goes ;-)
        }
    };

    $http.get('/api/directory/' + encodeURIComponent(tmp_path))
        .then(function(res) {
            console.log(res.errno);
            if (res.errno !== null) {
                $rootScope.folder = res.data;
                console.log('got res');
            }
        });

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
