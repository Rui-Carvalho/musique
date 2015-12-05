angular.module('app.core')
.directive('stopPropagation', function() {
    'use strict';

    return {
        restrict: 'A',
        link : function(scope, element) {
            element.bind('touchend', function (event) {
                event.stopPropagation();
            });
            element.bind('click', function (event) {
                event.stopPropagation();
            });
        }
    };
})
;
