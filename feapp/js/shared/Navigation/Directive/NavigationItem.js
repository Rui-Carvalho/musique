angular.module('app.nav')
/**
 * Navigation Item
 * Force menu to close once selected
 * @TODO recognise active link
 */
.directive('navigationItem', function (NavigationManager) {
    'use strict';

    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        template: '<li ng-class="{active: active}" ng-transclude></li>',
        scope: true,
        link: function (scope, element, attrs) {
            scope.active = false;

            scope.collapse = function () {
                NavigationManager.setValue('main', false);
            };
        }
    };
})
;
