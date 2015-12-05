angular.module('app.core')
.directive('saveImage', function(CanvasService, $window) {
    'use strict';

    return {
        restrict: 'A',
        link : function(scope, element, attrs) {
            var canvas = CanvasService.create();
            var filename = attrs.filename !== undefined ? attrs.filename : 'image.png';

            canvas.addImage(attrs.href)
            .then(
                function () {
                    // code here
                }
            );

            element.bind('click', function (e) {
                e.preventDefault();

                var newUrl = canvas.getStreamContent();
                e.download = filename;
                $window.location.href = newUrl;
            });

            // add filename
            // http://jsfiddle.net/AbdiasSoftware/7PRNN/
        }
    };
});
