angular.module('app.menu')
.directive('appContainer',
function (EventManager, NavigationManager) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            name: '@'
        },
        replace: true,
        template: '<div><div class="o_layout-side-body__offset" ng-class="{\'is-open\':status}"></div><div class="o_layout-side-body__body-wrapper" ng-class="{\'is-open\':status}" ng-transclude></div></div>',
        transclude: true,
        link: function (scope, element, attrs) {
            scope.status = false;

            NavigationManager.onChange(
                function (data) {
                    if (data.container === scope.name) {
                        scope.status = data.value;
                    }
                }
            );

        }
    };
});
