(function (angular, jQuery) {
    "use strict";
    var AppWorkflow = angular.module('workflow', [
        'ngRoute',
        'ngResource',
        'ngCookies'
    ]);

    AppWorkflow.controller('routerList', ['$scope', '$resource',
        function ($scope,$resource) {
            "use strict";
            var res = $resource('___/route/:id',{id:'@index'});
            $scope.restNew = {
                path:'',
                fn:''
            };
            var routers = $scope.routers = res.query();
            $scope.remove = function(index){
                var _ = routers[index].$delete();
                _.then(function(){
                    routers.splice(index,1);
                })
            };
            $scope.add = function () {
                var _ = new res($scope.restNew);
                _.$save(function(d){
                    $scope.routers.push(d);
                });
            };
        }])
})(angular);