angular.module('app.menu')
.directive('appUserStatus',
    function (EventManager, NavigationManager,  AuthEvents, MenuEvents, UiEvents) {
        'use strict';

        return {
            template: '<a class="nav-icon-link  sans-serif cursor-pointer" title="{[{ user.id ? (user.firstname+\' \'+user.lastname) : \'Login\'}]}" ng-class="{active: user.id}" fast-click ng-click="handleClick($event)">'+

                '<span class="bold-font" ng-if="user.firstname">{[{user.firstname | limitTo:1}]}{[{user.lastname | limitTo:1}]}</span>'+

                '<i class="icon-profile" ng-if="!user.firstname"></i>'+
            '</a>',
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {},
            link: function (scope, element, attrs) {
                scope.status = false;
                scope.user = null;

                scope.handleClick = function (event, forceStatus) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    // force status overrides the switch
                    if (forceStatus === undefined) {
                        scope.status = !scope.status;
                    } else {
                        scope.status = forceStatus;
                    }

                    // toggle user nav
                    EventManager.emit(
                        MenuEvents.TOGGLE_USER,
                        {
                            status: scope.status
                        }
                    );
                };

                // events
                EventManager.on(
                    AuthEvents.USER_CHANGED,
                    function(user) {
                        scope.user = user;
                    }
                );

                EventManager.on(
                    UiEvents.WINDOW_CLICK,
                    function(user) {
                        scope.handleClick(null, false);
                    }
                );
            }
        };
    }
);