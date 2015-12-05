angular.module('app.auth')
    .directive('authRefreshToken',
    function (AuthService, UserService, $timeout) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                delay: '@'
            },
            link: function (scope, element, attrs) {

                var delay = parseInt(scope.delay, 10) || 1000;

                $timeout(function () {
                    AuthService.refresh()
                        .then(
                        function (user) {
                            UserService.getCurrent(true);
                        }
                    );
                }, delay);

            }
        };
    }
)
;
