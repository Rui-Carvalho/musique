angular.module('app.ui')
    .directive('uiSwipeRowComponent',
    function (ChannelManager, EventManager, UiEvents, DomService, $timeout) {
        'use strict';

        return {
            template: '<div class="relative" ng-style="parentStyle"><div class="swipe-component absolute" ng-style="customStyle" ng-swipe-right="handleToggle(false)" ng-swipe-left="handleToggle(true)" ng-transclude></div></div>',
            restrict: 'E',
            replace: true,
            scope: {
                // channel: '@',
                offset: '@',
                disableDesktop: '@'
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var isEmitter = false,
                    rowElement = element[0].children[0].children[0],
                    rowHeight = 0;

                scope.status = false;
                scope.customStyle = {
                    position: 'relative'
                };
                scope.parentStyle = {};

                scope.handleToggle = function (status) {
                    scope.status = status;

                    // send
                    if (status) {
                        isEmitter = true;
                        scope.customStyle.left = status ? (scope.offset || 10) + 'px' : 0;

                        EventManager.emit(
                            UiEvents.CHANGE_SWIPE,
                            {
                                status: status
                            }
                        );
                    } else {
                        scope.customStyle.left = 0 + 'px';
                    }
                };

                // listen to same events and reset status
                EventManager.on(
                    UiEvents.CHANGE_SWIPE,
                    function(data) {
                        if (!isEmitter) {
                            scope.handleToggle(false);
                        }
                        isEmitter = false;
                    }
                );

                // lazy apply styles
                $timeout(function () {
                    scope.parentStyle = {
                        height: DomService.getHeight(rowElement) + 'px'
                    };
                    scope.customStyle = {
                        position: 'absolute',
                        left: 0 + 'px',
                        top: 0 + 'px'
                    };
                }, 3000);

            }
        };
    }
);
