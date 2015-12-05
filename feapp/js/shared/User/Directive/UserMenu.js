angular.module('app.user')
    .directive('userMenu',
    function (EventManager, AuthModalService, UrlService, $timeout, AuthEvents) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                legacy: '@'
            },
            replace: true,
            templateUrl: '/templates/Framework/navigation_user',
            //transclude: true,
            link: function (scope, element, attrs) {
                scope.user = {};

                var legacy = scope.legacy === 'true';

                // set legacy mode
                AuthModalService.setLegacyMode(legacy);

                EventManager.on(AuthEvents.USER_CHANGED, function (user) {
                    scope.user = user;
                });

                scope.login = function (event) {
                    event.preventDefault();
                    AuthModalService.setSubscribeSource('MainMenu');
                    AuthModalService.openLogin('default', {}, true);
                };

                scope.signup = function (event) {
                    event.preventDefault();
                    AuthModalService.setSubscribeSource('MainMenu');
                    AuthModalService.openSignup('default', {});
                };

                /**
                 * Logout from menu, if legacy is set will redirect to home page
                 * @param event
                 */
                scope.logout = function (event) {
                    event.preventDefault();
                    AuthModalService.openLogout();
                };

            }
        };
    }
)

;
