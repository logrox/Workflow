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
                    controller:"functionList",
                    url: "/function/:id",
                    templateUrl: "../tpl/function.html"
                })
                .state('route', {
                    controller:"routerList",
                    url: "/route",
                    templateUrl: "../tpl/main.html"
                });
        }])
        .controller('functionList', ["$scope", "$resource", function ($scope, $resource) {
            "use strict";
            var res = $resource('___/fn/:index', {index: '@index'});
            $scope.fnLists = {};
            var newResource = $scope.newResource = {
                name: '',
                body: ''
            };

            $scope.fnRemove = fnRemove;
            $scope.fnAdd = fnAdd;
            $scope.fnUpdate = fnUpdate;

            res.get().$promise.then(function (res) {
                "use strict";
                $scope.fnLists = res;
            });

            function fnRemove(){
                "use strict";

            }
            function fnAdd(){
                "use strict";
                var newFn = new res(newResource);
                newFn.$save(function(res){
                    console.log('Dodano funkcje');
                });
            }
            function fnUpdate(){
                "use strict";

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