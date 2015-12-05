angular.module('app.nav')
/**
 * Navigation container
 * bind variable to show/hide menu
 */
.directive('navigationContainer', function (NavigationManager, $window, EventManager, DomService) {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            disableScroll: '@',
            swipe: '@'
        },
        template: '<div ng-style="customStyle" ng-class="{open: open}" ng-swipe-left="handleSwipeLeft()" ng-swipe-right="handleSwipeRight()" ng-transclude></div>',
        transclude: true,
        link: function (scope, element, attrs) {
            var scrollEnabled = scope.disableScroll === 'true' ? false : true;

            scope.open = false;
            scope.customStyle = {};

            NavigationManager.onChange(
                function (data) {
                    if (data.container === scope.name) {
                        scope.open = data.value;

                        //fix home page weird behavior
                        if (scope.open && scrollEnabled) {
                            DomService.scrollToElement(element, 0, 200);
                        }
                    }
                }
            );

            if (scope.swipe == 'left') {
                scope.handleSwipeLeft = function() {
                    NavigationManager.toggle(scope.name);
                };
            }

            if (scope.swipe == 'right') {
                scope.handleSwipeRight = function() {
                    NavigationManager.toggle(scope.name);
                };
            }

            scope.collapse = function () {
                NavigationManager.closeAll();
            };

            // set height
            scope.repaint = function () {
                scope.customStyle = {
                    height: DomService.getHeight() + 'px'
                };
            };

            scope.repaint();

            DomService.bind('resize', scope.repaint);
        }
    };
})
;
