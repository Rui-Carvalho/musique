angular.module('app.core')

/**
 * Main Directive
 */
    .directive('stickyHeader',
    function ($log, $window, $timeout, EventManager, stickyHeaderManager, DomService, AgentService, CoreEvents) {
        'use strict';

        return {
            restrict: 'E',
            template: '<div class="sticky-container force-static-xs force-static-sm relative" ng-style="containerStyle"><div class="sticky" ng-show="isVisible" ng-style="blockStyle" ng-class="blockClass" ng-transclude></div></div>',
            transclude: true,
            scope: {
                id: '@',
                offset: '@',
                autoHide: '@',
                stackable: '@',
                lazy: '@',
                resizable: '@',
                fixedHeight: '@',
                excludeDevice: '@'
            },
            replace: true,
            link: function (scope, element) {
               var isDeviceExcluded = false;
               scope.excludeDevice = scope.excludeDevice !== undefined ? scope.excludeDevice : null;

               if (scope.excludeDevice === 'mobile') {
                  isDeviceExcluded = AgentService.isMobilePhone();
               }

                var el = element[0],
                    box = el.children[0],
                    boxTop = DomService.getAbsoluteTop(el),
                    boxLeft = DomService.getLeft(box),
                    containerHeight = scope.fixedHeight ? parseInt(scope.fixedHeight) : DomService.getHeight(el),
                    containerWidth = DomService.getWidth(el),
                    height = DomService.getHeight(box),
                // width = DomService.getWidth(box),
                    newStatus = -1,
                    oldStatus = -1,
                    offset = scope.offset ? parseInt(scope.offset, 10) : 60, // must be > navbar height
                    autoHide = scope.autoHide ? parseInt(scope.autoHide, 10) : 0,
                    lazy = scope.lazy === 'true' ? true : false,
                    stackable = scope.stackable === 'false' ? false : true,
                    resizable = scope.resizable === 'true' ? true : false,
                    zindex = stickyHeaderManager.getZIndex(),
                    id = scope.id || stickyHeaderManager.generateContainerId(),
                    enabled = true,
                    lock = false,
                    stopper = null
                    ;

                scope.blockStyle = {};
                scope.blockClass = {};

                // automatically hide navigation
                scope.containerStyle = {
                    height: containerHeight + 'px',
                    width: '100%'
                    // background: 'red'
                };

                /**
                 * Reassign new width
                 */
                scope.init = function (forceDigest) {
                    forceDigest = forceDigest !== undefined ? forceDigest : true;

                    $log.debug('Init Sticky Header');
                    scope.setNewDimensions();
                    containerWidth = DomService.getWidth(el);
                    oldStatus = -1;

                    DomService.requestAnimationFrame(scope.refresh);
                };

                scope.setStatus = function (status) {
                    if (scope.isFixed != status) {
                        $log.debug('Set Status');
                        scope.isFixed = status;
                        EventManager.emit('stickyHeaderChanged', {id: id, fixed: scope.isFixed});
                    }
                };

                // this is called from window so must digest!
                scope.refresh = function (event) {
                    if (!lock) {
                        if (!enabled) {
                            return;
                        }

                        // needed on people widget
                        if (resizable) {
                            height = DomService.getHeight(box);
                        }

                        stopper = stickyHeaderManager.getStopper(id, height + offset);

                        if (stopper) {
                            scope.isVisible = true;
                            scope.setStatus(false);
                            // $log.debug('Absolute at:' + (stopper - boxTop), TopBox);
                            scope.blockStyle = {
                                zIndex: zindex,
                                position: 'absolute',
                                width: containerWidth + 'px',
                                top: (stopper - boxTop - height) + 'px',
                                left: boxLeft
                            };
                            scope.blockClass = 'sticky-absolute';
                            newStatus = 0;
                        } else if (DomService.getTop(el) - offset + autoHide <= 0) {
                            scope.isVisible = true;

                           // hack @Marco can you help? Marco: NO!
                           if ( !isDeviceExcluded ) {
                              scope.blockStyle = {
                                 position: 'fixed',
                                 zIndex: zindex,
                                 width: containerWidth + 'px',
                                 top: offset + 'px',
                                 left: boxLeft
                              };
                           }

                            scope.blockClass = 'sticky-fixed';
                            scope.setStatus(true);
                            newStatus = 1;
                        } else {
                            scope.blockStyle = {
                                width: containerWidth + 'px',
                                top: '0px',
                            };
                            scope.blockClass = '';
                            // hide block
                            if (autoHide) {
                                scope.isVisible = false;
                            }
                            scope.setStatus(false);
                            newStatus = 2;
                        }

                        // prevent multiple apply
                        if (oldStatus !== newStatus) {
                            if (event) {
                                $log.debug('Apply', oldStatus, newStatus);
                                scope.$apply();
                            }
                            oldStatus = newStatus;
                        }

                        lock = false;
                    }

                    // magic here
                    DomService.requestAnimationFrame(scope.refresh);
                };

                /**
                 * Apply only if resizable
                 */
                scope.setNewDimensions = function (force) {
                    if (resizable || force) {
                        boxTop = DomService.getAbsoluteTop(el);
                        containerHeight = DomService.getHeight(el);
                        containerWidth = DomService.getWidth(el);
                        height = DomService.getHeight(box);
                        boxLeft = DomService.getLeft(el);
                        // // transform parent into absolute
                        angular.extend(scope.containerStyle,
                            {
                                // width: containerWidth + 'px',
                                // position: 'absolute',
                                height: containerHeight + 'px',
                            }
                        );
                    }
                };

                /**
                 * Init Phase
                 */
                if (autoHide) {
                    scope.isVisible = false;
                } else {
                    scope.isVisible = true;
                }

                // use this only if layout changes after page load
                if (lazy) {
                    enabled = false;
                    $timeout(function () {
                        enabled = true;
                        scope.init(true);
                    }, 1500);
                } else {
                    scope.init(true);
                }

                // add to containers
                if (stackable) {
                    stickyHeaderManager.addContainer(id, el);
                }

                scope.setStatus(true);

                // DomService.bind('scroll', scope.refresh);
                // DomService.bind('touchmove', scope.refresh);
                // DomService.bind('gesturechange', scope.refresh);
                DomService.bind('resize', scope.init);

                // listen for injected banners!!!
                EventManager.on(
                    CoreEvents.REPAINT,
                    function (data) {
                        $timeout(
                            function () {
                                scope.init(false);
                            },
                            100
                        );
                    }
                );
            }
        };
    }
)

/**
 * Stopper
 */
    .directive('stickyHeaderStopper',
    function ($log, stickyHeaderManager) {
        'use strict';

        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                stickyHeaderManager.addStopper(attrs.id, element[0]);
            }
        };
    }
)

/**
 * show/hide based on sticky header status
 */
    .directive('showWhenFixed',
    function (EventManager) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                id: '@showWhenFixed'
            },
            link: function (scope, element) {
                var status = null;
                element.addClass('show-when-fixed');

                // apply new css
                scope.changeStatus = function (fixedStatus) {
                    status = fixedStatus;

                    if (status) {
                        element.addClass('show');
                    } else {
                        element.removeClass('show');
                    }
                };

                // listen to change event
                EventManager.on('stickyHeaderChanged', function(data){
                    if (data.id === scope.id && status !== data.fixed) {
                        scope.changeStatus(data.fixed);
                    }
                });
            }
        };
    }
)

;
