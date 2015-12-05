// code from angular.js core

angular.module('app.core')
    .directive('ngLazyMouseover',
    function ($log, $parse, GlobalTick) {
        'use strict';

        return {
            restrict: 'A',
            compile: function($element, attr) {
                var directiveName = 'ngLazyMouseover';

                var fn = $parse(attr[directiveName], /* interceptorFn */ null, /* expensiveChecks */ true);
                return function ngEventHandler(scope, element) {

                    element.on('mouseout', function(event) {
                        GlobalTick.cancel();
                    });

                    element.on('mousepress', function(event) {
                        GlobalTick.cancel();
                    });

                    element.on('mouseover', function(event) {
                        var callback = function() {
                            fn(scope, {$event:event});
                        };

                        //   if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                        //     scope.$evalAsync(callback);
                        //   } else {
                        //     scope.$apply(callback);
                        //   }


                        GlobalTick.execute(callback, 350);
                    });
                };
            }
        };
    }
);
