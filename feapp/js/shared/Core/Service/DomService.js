angular.module('app.core')
.service('DomService',
    function ($log, $window, $document, $location, $anchorScroll, $timeout) {
        'use strict';

        var bodyElement = angular.element($document[0].body),
            htmlElement = angular.element(document.getElementsByTagName('html')[0]),

            cnt = 1,
            windowRef = angular.element($window);

        /**
         * Bind to window
         */
        this.bind = function (event, callback) {
            return windowRef.on(event, callback);
        };

        this.getElement = function(selector) {
            return angular.element($window.document.querySelector(selector));
        };

        this.getElements = function(selector) {
            return angular.element($window.document.querySelectorAll(selector));
        };

        this.getElementById = function(id) {
            return angular.element(document.getElementById(id));
        };

        /**
         * Get box height
         * @param element
         * @returns {number}
         */
        this.getHeight = function (element) {
            if (!element) {
                return $window.innerHeight;
            } else {
                return parseInt(element.getBoundingClientRect().height, 10);
            }
        };

        this.getWidth = function (element) {
            if (!element) {
                return $window.innerWidth;
            } else {
                return parseInt(element.getBoundingClientRect().width, 10);
            }
        };

        /**
         * Get parent width
         * @param element
         * @returns {number}
         */
        this.getParentWidth = function (element) {
            var parent = null,
                width = 0;

            // limit nodes
            for (var i=0; i<10; i++) {
                parent = angular.element(element).parent()[0];
                width =  this.getWidth(parent);
                if (width > 0 ) {
                    return width;
                } else {
                    element = parent;
                }
            }

            return null;
        };

        /**
         * Relative to viewArea
         * @param element
         * @returns {Number}
         */
        this.getTop = function (element) {
            return parseInt(element.getBoundingClientRect().top, 10);
        };

        /**
         * Useful on page reload as scroll can be != 0
         * @param element
         * @returns {number}
         */
        this.getAbsoluteTop = function (element) {
            return parseInt($window.pageYOffset + element.getBoundingClientRect().top, 10);
        };

        this.getAbsoluteBottom = function (element) {
            return parseInt(element.getBoundingClientRect().bottom - $window.innerHeight, 10);
        };

        this.getBottom = function (element) {
            return parseInt($window.innerHeight - element.getBoundingClientRect().top, 10);
        };

        this.getLeft = function (element) {
            return parseInt(element.getBoundingClientRect().left, 10);
        };

        // leave it here, it can do better stuff in the future :)
        this.getRect = function (element) {
            return element.getBoundingClientRect();
        };

        /**
         * Smooth scroll to element
         * @param element
         */
        this.scrollToElement = function (element, offset, duration) {
            offset = offset || 0;
            duration = duration !== undefined ? duration : 500;
            angular.element($document).scrollTo(element, offset, duration);
        };

        /**
         * Go to anchor
         */
        this.scrollToAnchor = function (id) {
            $location.hash(id).replace();
            $anchorScroll();
        };

        /**
         * Re-apply anchor
         */
        this.goToAnchor = function () {
            if ($window.location.hash) {
                $window.location.href = $window.location.href;
            }
        };

        this.getBodyScroll = function() {
            return bodyElement[0].scrollTop;
        };

        this.setBodyScroll = function(scroll) {
            bodyElement[0].scrollTop = scroll;
        };

        this.bodyScrollable = function (status) {

            if (status) {
                htmlElement.removeClass('noscroll');
                bodyElement.removeClass('noscroll');
            } else {
                htmlElement.addClass('noscroll');
                bodyElement.addClass('noscroll');
            }
        };

        this.getBody = function () {
            return bodyElement;
        };

        /**
         * Return window max dimension
         */
        this.getWindowMaxSize = function () {
            return $window.screen.availHeight > $window.screen.availWidth ? $window.screen.availWidth : $window.screen.availHeight;
        };

        this.getPointerPosition = function (event) {
            return {
                top: event.pageY,
                left: event.pageX,
            };
        };

        this.getUniqueId = function () {
            return 'unique_' + cnt++;
        };

        this.getHtmlTag = function () {
          return htmlElement;
        };

        /**
         * Return window max dimension
         * @DOM [<native-dom>,<native-dom>,...]
         *
         */
        this.DOMtoString = function (DOMNodeList) {
            var HTMLstring = [];

            // remove every not Node DOM Element 1 (it is not a deep detach)
            _.remove(DOMNodeList, function (elm,index,array) {
                if (elm.nodeType !== 1) {
                    return elm;
                }
            });

            // transform DOM to string
            _.forEach(DOMNodeList, function (elm,index,array) {
                HTMLstring.push(elm.outerHTML);
            });

            return HTMLstring.join('').replace('ng-scope', '');
        };

        /**
         * AnimationFrame polyfill
         * @param  {Function} callback animationLoop to execute when tick available
         */
        this.requestAnimationFrame = function (callback) {
            var animationFrame = $window.requestAnimationFrame ||
                    $window.webkitRequestAnimationFrame ||
                    $window.mozRequestAnimationFrame ||
                    function(callback){
                        $timeout(callback, 1000 / 30);
                    };

            animationFrame(callback);
        };
    }
);
