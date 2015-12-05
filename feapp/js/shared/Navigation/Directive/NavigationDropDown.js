angular.module('app.nav')
/**
 * Navigation container
 * bind variable to show/hide menu
 */
.directive('groupDropdown', function (DomService, EventManager) {
    'use strict';

    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            var uniqueId = DomService.getUniqueId(),
                status = false;

            // expose method, use this
            this.toggle = function (forceStatus) {
                if (forceStatus === undefined) {
                    status = !status;
                } else {
                    status = forceStatus;
                }

                if (status) {
                    $element.addClass('open');
                } else {
                    $element.removeClass('open');
                }

                EventManager.emit('NavigationChangeDropdown', {
                    emitter: uniqueId,
                    status: status
                });
            };

            this.setActive = function () {
                $element.addClass('active');
            };

            this.getStatus = function () {
                return status;
            };

            // close navs
            EventManager.on('NavigationChangeDropdown', function (data) {
                if (data.emitter !== uniqueId) {
                    status = false;
                    $element.removeClass('open');
                }
            });

            //see app.nav config
            EventManager.on('NavigationClose', function (data) {
                if (status) {
                    status = false;
                    $element.removeClass('open');
                }
            });

        }
    };
})
.directive('groupDropdownToggle', function ($window, EventManager, GlobalTick, AgentService) {
    'use strict';

    return {
        restrict: 'A',
        require: '^groupDropdown',
        link: function (scope, element, attrs, ctrl) {

            var disableMobile = attrs.disableMobile === 'true' ? true : false;

            // desktop only
            if (!AgentService.isTouch()) {

                // if mouseout cancel actions
                element.on('mouseout', function(event) {
                    GlobalTick.cancel();
                });

                // open menu after a timeout
                element.on('mouseover', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    // open only if closed !!!!
                    if (!ctrl.getStatus()) {
                        GlobalTick.execute(
                            function(){
                                ctrl.toggle(true);
                            },
                        500);
                    }
                });
            // mobile only and enabled
            } else if (!(disableMobile && AgentService.isMobile())){
                // on click open menu not link
                element.on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    ctrl.toggle();
                    // scope.$apply();
                });
            }

            // add active if path matches
            if ($window.location.pathname.indexOf(attrs.href) !== -1) {
                ctrl.setActive();
            }
        }
    };
})
.directive('groupDropdownMenu', function (EventManager, GlobalTick) {
    'use strict';

    return {
        restrict: 'A',
        require: '^groupDropdown',
        link: function (scope, element, attrs, ctrl) {

            element.on('mouseover', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });

            element.on('mouseout', function(event) {
                event.preventDefault();
                event.stopPropagation();

                // GlobalTick.execute(
                //     function(){
                //         ctrl.toggle(true);
                //     },
                // 500);
            });
        }
    };
})
;
