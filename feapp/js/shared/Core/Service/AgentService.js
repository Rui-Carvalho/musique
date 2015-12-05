angular.module('app.core')
    .factory('AgentService',
    function ($log, $window) {
        'use strict';

        function Factory() {

            /**
             * Return true is is touch
             * @returns {number}
             */
            this.isTouch = function () {
                if (('ontouchstart' in $window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0)) {
                    return true;
                }
                return false;
            };

            /**
             * See _variables.scss
             */
            this.isMobilePhone = function () {
                return $window.innerWidth <= 730;
            };
            this.isMobile = function () {
                return $window.innerWidth <= 780;
            };
            this.isDesktop = function () {
                return $window.innerWidth >= 1024;
            };

            /**
             * Detect shitty IE
             * @returns {boolean}
             */
            this.isIE = function () {
                var re =  new RegExp(/edge|trident|msie/i);
                return re.test(navigator.userAgent);
            };

        }

        return new Factory();
    }
);
