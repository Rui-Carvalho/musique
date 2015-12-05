angular.module('app.header')
.directive('headerBlock',
    function ($state, EventManager, ChannelManager, HeaderEvents, NavigationManager) {
        'use strict';

        return {
            templateUrl: '/templates/Spa/Header:index/',
            restrict: 'E',
            replace: true,
            scope: {
                name: '@'
                //,channel: '@'
            },
            link: function (scope, element, attrs) {
                var ChannelEventManager = ChannelManager.subscribe(scope.channel);

                scope.data = {};
                scope.status = false;

                scope.handleBack = function () {
                    if (scope.data.state) {
                        $state.go(scope.data.state);
                    }
                };

                NavigationManager.onChange(
                    function (data) {
                        if (data.container === scope.name) {
                            scope.status = data.value;
                        }
                    }
                );

                /**
                 * When loaded and something selected then scroll to this component
                 */
                EventManager.on(
                    HeaderEvents.UPDATE,
                    function (data) {
                        angular.extend(scope.data, data);
                    }
                );
            }
        };
    }
);
