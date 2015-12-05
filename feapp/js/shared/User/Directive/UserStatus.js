angular.module('app.user')
    /**
     * thumbnail
     */
    .directive('userStatus',
        function (EventManager, NavigationManager, $window, AuthEvents) {
            'use strict';

            return {
                template: '<a href="#" title="{[{ user.id ? (user.firstname+\' \'+user.lastname) : \'Login\'}]}" class="border-left nav-icon-link sans-serif" ng-class="{active: user.id}" fast-click ng-click="link($event)"><span class="bold-font">{[{user.firstname | limitTo:1}]}{[{user.lastname | limitTo:1}]}</span> <span ng-if="!user.firstname"><i class="icon-profile" ></i></span></a>',
                replace: true,
                restrict: 'E',
                transclude: true,
                scope: {
                },
                link: function (scope, element, attrs) {
                    scope.user = null;

                    EventManager.on(AuthEvents.USER_CHANGED, function(user) {
                        scope.user = user;
                    });

                    scope.link = function (event) {
                        event.preventDefault();

                        // toggle user nav
                        NavigationManager.toggle('user');
                    };

                }
            };
        }
    )

;
