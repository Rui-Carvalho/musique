angular.module('app.core')
    .factory('GlobalTick',
    function ($log, $timeout) {
        'use strict';

        function Factory() {
            var timer = null;

            /**
             * Timeout singleton
             */
            this.execute = function (callback, timeout) {
                // cancel timer
                this.cancel();

                timer = $timeout(
                    function(){
                        callback();
                    },
                timeout);
            };

            this.cancel = function () {
                if (timer) {
                    $timeout.cancel(timer);
                }
            };

        }

        return new Factory();
    }
);
