angular.module('app.core')
    .service('UrlService',
    function ($location, $window, store) {
        'use strict';

        var pageCacheName = 'LastRef';

        /**
         * get last part of url
         */
        this.getLast = function (url) {
            return '/' + url.split('/').slice(-1).pop();
        };

        this.getPath = function (url) {
            return url.split('?')[0];
        };

        this.changePath = function (path) {
            $location.path(path);
        };

        this.changeUrl = function (href) {
            $window.location.href = href;
        };

        this.gotoHomepage = function (path) {
            this.changeUrl('/');
        };

        /**
         * Set in to history
         * @param params
         */
        this.setQueryParams = function (params) {
            this.setAbsolutePath({}, '', $window.location.pathname + this.getQueryString(params));
        };

        this.reloadCurrentPage = function () {
            $window.location.reload();
        };

        this.setAbsolutePath = function (data, title, path) {
            title = title || $window.document.title;

            if ($window.history) {
                $window.history.pushState(data, title, path);
            }
            //set title now
            $window.document.title = title;
        };

        /**
         * Parse QueryString
         * @param url
         * @returns {{}}
         */
        this.parseQuery = function (url) {

            url = url || $window.location.search;

            var temp = url.split(/[\?\&]/),
                obj  = {},
                k;

            angular.forEach(temp, function (part) {
                k = part.split('=');
                if (k.length === 2) {
                    obj[k[0]] = decodeURIComponent(k[1]);
                }
            });
            return obj;
        };

        /**
         * Generate QueryString
         * @param params
         * @returns {string}
         */
        this.getQueryString = function (params) {
            var queryString = [];

            if (!_.isEmpty(params)) {
                angular.forEach(params, function (value, key) {
                    queryString.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                });
                return  '?' + queryString.join('&');
            } else {
                return '';
            }
        };

        /**
         * Clear querystring
         */
        this.clearQuery = function () {
            if ($window.history) {
                $window.history.replaceState({}, $window.document.title, this.getPath($window.location.href));
            }
        };

        /**
         * Set current url to cache
         */
        this.setUrlToCache = function () {
            store.set(pageCacheName, $window.location.href);
        };

        /**
         * Go to saved url
         */
        this.goToCachedUrl = function () {
            var cached = store.get(pageCacheName);

            if (cached !== $window.location.href && cached) {
                $window.location.href = cached;
            }
        };

    }
)
;
