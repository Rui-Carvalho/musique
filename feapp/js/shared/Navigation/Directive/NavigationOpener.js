angular.module('app.nav')
/**
 * Small directive for openers
 */
.directive('navigationOpener', function (NavigationManager) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                scope.$apply(function(){
                    NavigationManager.toggle('main');
                });
            });
        }
    };
})
;
