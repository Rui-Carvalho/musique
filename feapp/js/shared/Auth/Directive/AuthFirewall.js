angular.module('app.auth')
    .directive('authFirewall',
    function (EventManager, AuthService, $window, HistoryService, AuthModalService, UrlService, AuthEvents) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                status: '@',
                source: '@'
            },
            link: function (scope) {

                var status = scope.status || 'default';

                EventManager.on(AuthEvents.USER_CHANGED, function (user) {
                    if (!user.id) {
                        // do not remove this comment as we need to enable when BoF2 will be removed

                        AuthModalService.setSubscribeSource(scope.source);
                        AuthModalService.openLogin(status)
                            .then(
                            function () {
                                // logged in
                            },
                            function () {
                                UrlService.gotoHomepage();
                                //remove any injected content if present
                                EventManager.emit('articleInjectChange', null);
                                //show backdrop
                                EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: true});
                            }
                        );


                    }
                });
            }
        };
    }
)
;
