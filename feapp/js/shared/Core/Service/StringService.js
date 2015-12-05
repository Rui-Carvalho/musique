angular.module('app.core')
    .service('StringService',
    function () {
        'use strict';

        this.capitalize = function (s) {
            if (typeof s === 'string') {
                var ret = s.split('');
                if (ret.length > 0) {
                    ret[0] = ret[0].toUpperCase();
                }
                return ret.join('');
            } else {
                return s;
            }
        };

    }
);
