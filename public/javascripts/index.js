(function (angular, jQuery) {
    "use strict";
    var AppWorkflow = angular.module('workflow', [
            'ngRoute',
            'ngResource',
            'ngCookies',
            'ui.router'
        ])
        .config(["$urlRouterProvider", "$stateProvider", function ($urlRouterProvider, $stateProvider) {
            "use strict";
            $urlRouterProvider.otherwise('/main');
            $stateProvider
                .state('main', {
                    url: "/main",
                    templateUrl: "../tpl/main.html"
                })
                .state('function', {
                    controller: "functionList",
                    url: "/function/:id",
                    templateUrl: "../tpl/function.html"
                })
                .state('route', {
                    controller: "routerList",
                    url: "/route",
                    templateUrl: "../tpl/main.html"
                });
        }])
        .controller('functionList', ["$scope", "$resource", function ($scope, $resource) {
            "use strict";
            var res = $resource('___/fn/:name', {name: '@name'});
            var resFileFn = $resource('___/fn/:operation',null, {
                saveFile: {method: "POST", params: {operation: "save"}, isArray: false},
                readFile: {method: "POST", params: {operation: "read"}, isArray: false}
            });
            $scope.fnLists = {};
            $scope.newResource = {
                name: '',
                body: '',
                description:""
            };

            $scope.fnRemove = fnRemove;
            $scope.fnAdd = fnAdd;
            $scope.fnUpdate = fnUpdate;

            $scope.saveToHdd = saveToHdd;
            $scope.readFromHdd = readFromHdd;

            res.get().$promise.then(function (res) {
                "use strict";
                $scope.fnLists = res;
            });

            function fnRemove(name) {
                "use strict";
                $scope.fnLists.$remove({name:name})
            }

            function fnAdd() {
                "use strict";
                var newFn = new res($scope.newResource);
                newFn.$save(function (res) {
                    console.log('Dodano funkcje');
                    $scope.fnLists = res;
                });
            }

            function fnUpdate() {
                "use strict";

            }

            function saveToHdd() {
                if (confirm("Nadpisać plik?."))
                    resFileFn.saveFile().$promise.then(function (res) {
                        console.log("Zapisano na Dysku: ", res);
                    });
            }
            function readFromHdd(){
                resFileFn.readFile().$promise.then(function (res) {
                    console.log("Dane odczytano: ", res);
                    $scope.fnLists = res;
                })
            }

        }])
        .controller('routerList', ['$scope', '$resource',
            function ($scope, $resource) {
                "use strict";
                var res = $resource('___/route/:id', {id: '@index'});
                $scope.restNew = {
                    path: '',
                    fn: ''
                };
                var routers = $scope.routers = res.query();
                $scope.remove = function (index) {
                    var _ = routers[index].$delete();
                    _.then(function () {
                        routers.splice(index, 1);
                    })
                };
                $scope.add = function () {
                    var _ = new res($scope.restNew);
                    _.$save(function (d) {
                        $scope.routers.push(d);
                    });
                };
            }])
})(angular);