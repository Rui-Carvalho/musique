angular.module('app.subscription',
    [
    ])
    .run(function (EventManager, SubscriptionService, AuthEvents) {
        'use strict';

        // get followed and emit Event, returns a promise


        // clear chache if user is anon
        EventManager.on(
            AuthEvents.USER_CHANGED,
            function (user) {
                if (!user.id) {
                    SubscriptionService.clearCache();
                } else {
                    SubscriptionService.init();
                }
            }
        );

    })
;
