angular.module('app.auth')
    .directive('authReadLimit',
    function (EventManager, AuthService, $window, HistoryService, AuthModalService, UrlService, AuthEvents) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                store: '@',
                limit: '@',
                source: '@',
                uniqueId: '@'
            },
            link: function (scope) {

                var limit = parseInt(scope.limit, 10) || 10,
                    store = scope.store || 'content_token',
                    limitCounter = 0;

                EventManager.on(AuthEvents.USER_CHANGED, function (user) {
                    if (!user.id) {
                        // select right method
                        limitCounter =  scope.uniqueId ? AuthService.getUniqueMonthlyViews(store, scope.uniqueId) : AuthService.getMonthlyViews(store);

                        if (limitCounter > limit) {

                            // request a login modal with custom message
                            AuthModalService.setSubscribeSource(scope.source);
                            AuthModalService.openLogin('contentLimit', {firewall: true})
                                .then(
                                function () {
                                    // logged in
                                },
                                function () {
                                    // The below code cannot work as if you go back you might go back to a page that
                                    // is also protected, thus you will be stuck in an infinite loop
                                    // force browser to leave the page
                                    // HistoryService.goBack();
                                    UrlService.gotoHomepage();

                                    //remove any injected content if present
                                    EventManager.emit('articleInjectChange', null);
                                    //show backdrop
                                    EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: true});
                                }
                            );
                        }
                    }
                });
            }
        };
    }
)
;
