angular.module('app.ui')
    .directive('uiLoadMoreComponent',
    function (ChannelManager, UiEvents) {
        'use strict';

        return {
            template: '<button ng-click="handleClick()"><ng-transclude/></button>',
            restrict: 'E',
            replace: true,
            scope: {
                channel: '@'
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var ChannelEventManager = ChannelManager.subscribe(scope.channel);

                scope.status = null;

                scope.handleClick = function () {

                    // send to other sorter and table
                    ChannelEventManager.emit(
                        UiEvents.LOAD_MORE,
                        {
                        }
                    );

                    // we can plug wait status here
                };
            }
        };
    }
);
