angular.module('app.search')
.controller('SearchTypeAheadController',
    function($scope, $window, $modalInstance, SearchService, modalData){
        'use strict';

        var lock = false;

        $scope.data = {
            query: modalData.query
        };
        $scope.items = [];

        $scope.close = function () {
            $modalInstance.dismiss();
        };

        $scope.openSearch = function () {
            $window.location.href = '/search/?q=' + $scope.data.query;
        };

        $scope.spyEnter = function (event) {
            if (event.keyCode === 13 || event.type === 'click') { //Enter
                $scope.openSearch();
            }
        };

        $scope.link = function (href) {
            $window.location.href = href;
        };

        // import data from directive
        $scope.$watch('data.query', function(n, o){
            if (!lock && $scope.data.query.length > 1) {
                lock = true;
                SearchService.getAll({query: $scope.data.query}).then(
                    function (res) {
                        $scope.items = res.results;
                        lock = false;
                    },
                    function () {
                        $scope.items = [];
                    }
                );
            } else {
                $scope.items = [];
            }
        });



    }
)
;
