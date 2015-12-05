angular.module('app.core')
    .service('PageCountService',
    function ($log, $sessionStorage) {
        'use strict';

        var name = 'BOFPV';

        this.increase = function() {
            if($sessionStorage[name]) {
                $sessionStorage[name]++;
            } else {
                $sessionStorage[name] = 1;
            }
        };

        this.getPageCount = function() {
            return $sessionStorage[name];
        };

        this.reset = function () {
            $sessionStorage[name] = 0;
        };
    }
);
