angular.module('app.menu')
.directive('appStatus',
    function (EventManager, NavigationManager, AgentService, CoreEvents) {
        'use strict';

        return {
            template: '<a ng-click="handleClick($event)"><i class="inline-block  icon-toogle-sidebar  color-base" ng-class="{\'icon-rotate-180\':status}"></i></span></a>',
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                name: '@'
            },
            link: function (scope, element, attrs) {
                scope.status = false;

                scope.handleClick = function (event) {
                    if (event) {
                        event.preventDefault();
                    }

                    //toggle
                    scope.status = !scope.status;

                    NavigationManager.toggle(scope.name);

                    EventManager.emit(
                        CoreEvents.REPAINT,
                        {status: true}
                    );
                };

                NavigationManager.onChange(
                    function (data) {
                        if (data.container === scope.name) {
                            scope.status = data.value;
                        }
                    }
                );

            }
        };
    }
);
