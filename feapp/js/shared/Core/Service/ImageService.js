angular.module('app.core')
    .service('ImageService', function ($log, $window, DomService, GlobalParameters) {
        'use strict';

        var self = this;

        // http://img.businessoffashion.com/(600)/(800)/resize/media/uploads/2014/12/lead-copy.png
        self.domain = GlobalParameters.OpenrossHost;
        self.re = /([a-z]+\.[a-z]+)\/([\d]+)\/([\d]+)/;
        self.defaultMode = 'resize';

        //retina display and image max width bug :/
        var imageMaxSize = 1800,
            thumbSize = 100,
            maxBoxDimension = $window.screen.availHeight > $window.screen.availWidth ? $window.screen.availWidth : $window.screen.availHeight,
            ratio = $window.devicePixelRatio ? $window.devicePixelRatio : 1,
            boxSize = Math.ceil(maxBoxDimension * ratio);

        self.boxSize = boxSize < imageMaxSize ? boxSize : imageMaxSize;
        self.thumbSize = thumbSize;

        // cap ratio as image quality is too high!
        if (ratio > 1) {
            $log.debug('ImageService Cap ratio', ratio);
            ratio = 1.2;
        }

        /**
         * Multiply image size by ratio
         * @param size
         * @returns {number}
         * @private
         */
        self._getImageSize = function (size) {
            return parseInt(size * ratio, 10);
        };

        // maximum dim normalised
        self._normalise = function (dim) {
            var k = 1;

            if (dim.w > imageMaxSize || dim.h > imageMaxSize) {
                // $log.debug('Normalise Start',dim);
                k = dim.w/dim.h;

                if (dim.w > dim.h) {
                    dim.w = imageMaxSize;
                    dim.h = parseInt(dim.w/k);
                } else if (dim.w < dim.h){
                    dim.h = imageMaxSize;
                    dim.w = parseInt(dim.h*k);
                } else {
                    dim.w = imageMaxSize;
                    dim.h = imageMaxSize;
                }

                // $log.debug('Normalise End',dim);
            }
        };

        /**
         * Replace image path, if containerWidth is passed will try to detect parent size
         * @param src
         * @param containerWidth
         * @returns {*}
         */
        self.getImage = function (src, containerWidth) {
            if (src) {
                return src.replace(self.re,
                    function (matches, domain, w, h) {

                        var k = 1,
                            dim  ={
                            w: self._getImageSize(parseInt(w)),
                            h: self._getImageSize(parseInt(h))
                        };

                        // use container width
                        if (containerWidth) {
                            //$log.debug('ImageService Use container width', containerWidth);
                            k = dim.w/dim.h;
                            dim.w = self._getImageSize(containerWidth);
                            dim.h = parseInt(dim.w/k);
                        }

                        // apply cap
                        self._normalise(dim);

                        return [domain, dim.w, dim.h].join('/');
                    }
                );
            } else {
                return src;
            }
        };

        /**
         * Used from openross filter
         * @param src
         * @param w
         * @param h
         * @param domain force another domain
         * @returns {string}
         */
        self.getOpenRossImage = function (src, w, h, mode, offsetX, offsetY) {
            mode = mode || self.defaultMode;

            if (mode === 'cropcustomoffset') {
                return self.domain + '/' + w + '/' + h + '/' + mode + '_' + offsetX + '_' + offsetY + '/' + src;
            } else {
                return self.domain + '/' + w + '/' + h + '/' + mode + '/' + src;
            }
        };



    }
);
