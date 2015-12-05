angular.module('app.core')
.directive('disableIfPreFilled', function($timeout) {
    'use strict';

    return {
        restrict: 'A',
        require: 'ngModel',
        link : function(scope, element, ctrl) {
            var ngModel = ctrl,
                init = false,
                watchRef = null;


            watchRef = scope.$watch(
                function () {
                    return element.val();
                },
                function (nv, ov) {
                    if (nv) {
                        element.attr('disabled', 'disabled');    
                    }
                    watchRef();
                }
            );

        }
    };
})
;
