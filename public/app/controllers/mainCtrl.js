angular.module('kibibitCodeEditor')

.controller('mainController', function($rootScope, $scope, $location, Auth, $http, ModalService) {

    var vm = this;

    vm.showAModal = function() {
        ModalService.showModal({
          templateUrl: "app/components/yesnoModal/yesnoModalTemplate.html",
          controller: "yesnoModalController",
          controllerAs: "yesnoModalCtrl"
        }).then(function(modal) {
          modal.close.then(function(result) {
            $scope.customResult = "All good!";
          });
        });
      };

    $rootScope.code = "alert('hello world');";

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

    $scope.currentFolder = "";


    // binds the selected tree folder to a variable
    vm.currentFolder = function(node) {
        $scope.currentFolder = node.path;
    };


    // show the default projects directory to choose a folder from
    vm.openProject = function() {
        $http.get('/api/userHomeDirectory/')
            .then(function(res) {
                userHomeDirectory = res.data;
                vm.getFolder(userHomeDirectory, function(res) {
                    $scope.userHomeDirectory = res.data;
                    console.log('got res: ' + res);
                });
                $scope.projectFolder = true;
            });
    };

    // open the chosen project folder 
    vm.openFolder = function() {
        $scope.aceSession.setValue(null);
        $scope.projectFolder = false;
        console.log($scope.currentFolder);
        vm.getFolder($scope.currentFolder, function(res) {
            $scope.workFolder = res.data;
            console.log('got res: ' + res);
        })
    };

    // get folder name once
    vm.getFolder = function(folderToGet, callback) {
        $http.get('/api/directory/' + encodeURIComponent(folderToGet))
            .then(function(res) {
                console.log(res.errno);
                if (res.errno !== null && typeof callback === 'function') {
                    callback(res);
                }
            });
    }


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
            $http.get('/api/file/' + encodeURIComponent(node.path))
                .then(function(res) {
                    console.log(res.errno);
                    if (res.errno !== null) {
                        $scope.aceSession.setValue(res.data);
                    }
                })
        }
    };


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
