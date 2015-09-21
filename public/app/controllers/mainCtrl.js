angular.module('mainCtrl', ['ui.ace'])

.controller('mainController', function($rootScope, $location, Auth, $http) {

    var vm = this;

$rootScope.code = "alert('hello world');";

    $rootScope.editorOptions = {
        mode: 'javascript',
        theme: 'monokai'
    };

    $http.get('/api/directory/' + encodeURIComponent('/home/thatkookooguy/Downloads/test'))
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
