angular.module('app.ads')
    .directive('loadAdvertise',
    function ($log, DomService) {
        'use strict';

        return {
            template: '<div class="row" ng-show="image"><a ng-href="{[{href}]}" target="_blank"><img ng-src="{[{image}]}"/></a></div>',
            replace: true,
            restrict: 'E',
            scope: {
                src: '@',
                href: '@'
            },
            link: function (scope, element) {
                // to refactor in a proper service!!!!!

                scope.image = null;
                scope.href = scope.href || 'http://bit.ly/1EIX9g7';

                var banners = {
                    290: '300x290',
                    // 320: '320.jpg',
                    // 350: '300.jpg',
                    970: '970.jpg'
                };

                var width = DomService.getParentWidth(element),
                    selected = null;

                $log.debug('Load Advertise, size:', width);

                angular.forEach(banners, function(img, size){
                    if (size <= width) {
                        selected = img;
                    }
                });

                if (selected) {
                    scope.image = 'http://cdn.businessoffashion.com/assets-access-layer/images/ads/asdasdas?sz='+ selected;
                }
            }
        };
    }
)
;
