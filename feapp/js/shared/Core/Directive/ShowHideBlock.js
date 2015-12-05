angular.module('app.core')
.directive('showHideBlock',
    function (EventManager, $localStorage, DomService) {
        return {
            scope: {
                id: '@',
                offset: '@',
                isVisible: '@',
                storeData: '@',
                animate: '@'
            },
            template: '<div ng-cloak><div class="animate-hide" ng-show="status" ng-transclude></div></div>',
            replace: true,
            transclude: true,
            restrict: 'E',
            link: function cookies(scope, element, attrs) {
                var animationTime = 2000,
                    blockOffset = parseInt(scope.offset, 10) || 0,
                    storeData = scope.storeData !== 'false',
                    animationEnabled = scope.animate !== 'false'
                    ;

                scope.status = scope.isVisible !== 'false';

                /**
                 * Check data and hide it
                 */
                if (storeData) {
                    if ($localStorage[scope.id] !== undefined) {
                        scope.status = $localStorage[scope.id];
                    } else {
                        scope.status = true;
                    }
                }

                /**
                 * Store into localStore
                 */
                scope.handleStatus = function (status) {
                    scope.status = status;
                    if (storeData) {
                        $localStorage[scope.id] = status;
                    }
                };

                /**
                 * From event
                 */
                EventManager.on(
                    'hideOnClick',
                    function (data) {
                        if (data.id === scope.id) {
                            scope.handleStatus(data.status);

                            if (data.status && animationEnabled) {
                                DomService.scrollToElement(element, blockOffset, animationTime);
                            }
                        }
                    }
                );

            }
        };
    }
)
.directive('showHideBlockEmitter',
    function (EventManager) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                id: '@',
                status: '@',
                preventDefault: '@'
            },
            template: '<div ng-transclude ng-click="handleClick($event)"></div>',
            link: function cookies(scope, element, attrs) {

                var emitStatus = scope.status === 'true',
                    preventDefault = scope.preventDefault === 'true'
                    ;

                scope.handleClick = function (event) {
                    if (preventDefault) {
                        event.preventDefault();
                    }

                    EventManager.emit(
                        'hideOnClick',
                        {
                            id: scope.id,
                            status: emitStatus
                        }
                    );
                };

            }
        };
    }
)
;
