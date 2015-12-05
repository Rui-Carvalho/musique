angular.module('app.ui')
    .directive('uiSortComponent',
    function (ChannelManager, UiEvents) {
        'use strict';

        return {
            template: '<div ng-click="handleClick()" class="cursor-pointer"><span ng-transclude></span><i class="inline-block icon-sort-arrow-stack  tiny-font  color-gray-dark" ng-class="{\'icon-sort-arrow-stack\': status == null,\'icon-sort-arrow\': status == false,\'icon-sort-arrow icon-rotate-180\': status == true}"/></div>',
            restrict: 'E',
            replace: true,
            scope: {
                channel: '@',
                label:  '@',
                key: '@'
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var ChannelEventManager = ChannelManager.subscribe(scope.channel);

                scope.status = null;

                scope.handleClick = function () {

                    if (scope.status !== null) {
                        scope.status = !scope.status;
                    } else {
                        scope.status = true;
                    }

                    // send to other sorter and table
                    ChannelEventManager.emit(
                        UiEvents.CHANGE_SORT,
                        {
                            key: scope.key,
                            order: scope.status ? scope.key : '-' +scope.key
                        }
                    );
                };

                // listen to same events and reset status
                ChannelEventManager.on(
                    UiEvents.CHANGE_SORT,
                    function(data) {
                        if (data.key !== scope.key) {
                            scope.status = null;
                        }
                    }
                );

            }
        };
    }
);
