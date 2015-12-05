angular.module('app.home')
    .controller('IndexController', function ($scope, $cookies, ArticleService) {
        'use strict';

        $scope.data = [1, 2, 3, 4];
        $scope.interval = 5000;

        if($cookies.subscribePopupPageview) {
            $cookies.subscribePopupPageview++;
        } else {
            $cookies.subscribePopupPageview = 1;
        }
    }
);