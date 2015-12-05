angular.module('app.menu')
    .directive('appUserMenu',
    function ($state, $timeout, EventManager, ChannelManager, AuthModalService, UrlService, AuthEvents, CompanyService, CoreEvents, MenuEvents) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                channel: '@'
            },
            replace: true,
            templateUrl: '/templates/Spa/Navigation:user_navigation/',
            link: function (scope, element, attrs) {
                var ChannelEventManager = ChannelManager.subscribe(scope.channel);

                scope.status = false;
                scope.user = {};

                scope.login = function (event) {
                    event.preventDefault();
                    AuthModalService.setSubscribeSource('MainMenu');
                    AuthModalService.openLogin('default', {}, true);
                };

                scope.signup = function (event) {
                    event.preventDefault();
                    AuthModalService.setSubscribeSource('MainMenu');
                    AuthModalService.openSignup('default', {}, true);
                };

                /**
                 * Logout from menu, if legacy is set will redirect to home page
                 * @param event
                 */
                scope.logout = function (event) {
                    event.preventDefault();
                    AuthModalService.openLogout();
                };


                // init
                // stop event propagation
                element.on('click', function(event){
                    event.stopPropagation();
                });

                //events
                EventManager.on(
                    MenuEvents.TOGGLE_USER,
                    function (data) {
                        scope.status = data.status;
                    }
                );

                EventManager.on(
                    AuthEvents.USER_CHANGED,
                    function (user) {
                        scope.user = user;
                    }
                );

                // tear-down
                scope.$on("$destroy", function() {
                   ChannelEventManager.destroy();
                });
            }
        };
    }
);
