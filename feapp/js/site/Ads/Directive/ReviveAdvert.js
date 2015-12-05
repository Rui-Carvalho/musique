angular.module('app.ads')
    .directive('reviveAds',
    function (ReviveService, CoreEvents, EventManager) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                init: '@'
            },
            link: function (scope, element) {
                ReviveService.observe(element[0])
                .then(
                    function (mutations) {
                        EventManager.emit(
                            CoreEvents.REPAINT,
                            {status: true}
                        );
                    }
                );

                // initialise service
                ReviveService.init();

            }
        };
    }
)
;
