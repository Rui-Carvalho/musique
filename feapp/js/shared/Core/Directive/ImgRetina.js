angular.module('app.core')
    .directive('imgResponsive',
    function ($log, ImageService, DomService) {
        'use strict';

        return {
            restrict: 'C',
            scope: {
                src: '@',
                ngSrc: '@',
                responsiveSrc: '@',
                background: '@',
                maxWidth: '@'
            },
            link: function (scope, element, attrs) {

                var osrc = scope.src ? scope.src : scope.ngSrc,
                    img = scope.responsiveSrc ? scope.responsiveSrc : osrc,
                    containerWidth = scope.maxWidth ? parseInt(scope.maxWidth) : null,
                    src = null,
                    linked = false,
                    el = element[0],
                    elRef = angular.element(el),
                    preloadPos = 100,
                    timer = null;

                // force fixed dimensions
                if (!containerWidth) {
                    containerWidth = DomService.getParentWidth(element);
                }
                src = ImageService.getImage(img, containerWidth);

                //check position
                scope.refresh = function () {
                    if (!linked) {
                        var newPos = DomService.getBottom(el); //$window.innerHeight - el.getBoundingClientRect().top;

                        if (newPos + preloadPos >= 0) {
                            $log.debug('Loading retina image:', src);
                            linked = true;
                            //$timeout.cancel(timer);

                            //init class
                            elRef.addClass('init');

                            //preload image
                            var image = new Image();
                            image.onload = function () {
                                //show image
                                if (scope.background) {
                                    el.style.backgroundImage = 'url(' + image.src + ')';
                                } else {
                                    el.src = image.src;
                                }
                                elRef.addClass('loaded');
                            };
                            image.src = src;
                        }

                        DomService.requestAnimationFrame(scope.refresh);
                    }
                };

                scope.refresh();

            }
        };
    }
)
;
