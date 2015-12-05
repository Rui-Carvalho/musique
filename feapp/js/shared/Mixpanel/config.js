angular.module('app.mixpanel',
    [])
    .config(function () {
    })
    .run(
    function (EventManager, MixpanelService, AuthEvents) {
        'use strict';

        // track
        EventManager.on(AuthEvents.USER_CHANGED, function (user){
            MixpanelService.identify(user);
        });

    }
);
