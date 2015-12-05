/**
 * Wrap legacy protected actions
 */

angular.module('app.auth')
    .directive('authActionWrapper',
    function (EventManager, AuthService, HistoryService, AuthModalService, AuthEvents) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                source: '@'
            },
            link: function (scope, element, attrs) {

                var user = {},
                    status = attrs.status || 'default';

                EventManager.on(AuthEvents.USER_CHANGED, function (data) {
                    user = data;
                });

                /**
                 * Open modal if user is not logged in?
                 */
                element.bind('click', function (event) {

                    if (!user.id) {
                        event.preventDefault();
                        event.stopPropagation();

                        AuthModalService.openLogin(
                            status,
                            {
                                status: status,
                                firewall: true,
                                source: scope.source
                            }
                        ).then(
                            function () {
                                // logged in
                            },
                            function () {

                            }
                        );

                    }
                });


            }
        };
    }
)
;
