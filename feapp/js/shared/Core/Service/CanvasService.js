angular.module('app.core')
    .factory('CanvasService',
    function ($log, $window, $q) {
        'use strict';

        function Factory() {

            var element = $window.document.createElement('canvas'),
                context = element.getContext('2d'),
                canvas = $window.document.createDocumentFragment().appendChild(element)
                ;

            this.addImage = function (url) {
                var deferred = $q.defer();

                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = url;

                img.onload = function(data) {
                    context.canvas.width = data.target.naturalWidth;
                    context.canvas.height = data.target.naturalHeight;
                    context.drawImage(img, 0,0);
                    deferred.resolve(true);
                };

                return deferred.promise;
            };

            this.getStreamContent = function (mime) {
                mime = mime || 'image/jpg';
                return canvas.toDataURL(mime).replace(/^data:image\/png/,'data:application/octet-stream');
            };

        }

        return {
            create: function () {
                return new Factory();
            }
        };
    }
);
