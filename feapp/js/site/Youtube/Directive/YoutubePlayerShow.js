angular.module('app.youtube')
    .directive('youtubePlayerHide',
    function (EventManager, YoutubeEvents) {
        'use strict';

        return {
            restrict: 'E',
            template: '<div class="animate-show" ng-class="{\'ng-show\': status}" ng-transclude></div>',
            replace: true,
            scope: {
                id: '@'
            },
            transclude: true,
            link: function (scope, element, attrs) {

                scope.status = true;

                EventManager.on(
                    YoutubeEvents.PLAYER_STATUS_CHANGED,
                    function (data) {
                        if (scope.id === data.id || !scope.id) {
                            scope.status = !data.status;
                        }
                    }
                );

            }
        };
    }
)
;
