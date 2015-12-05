angular.module('app.location')
    .service('LocationService',
    function ($log, $q, LocationRepository) {
        'use strict';

        var ready = false,
            self = this
            ;

        /**
         *
         * @returns {deferred.promise|*}
         */
        this.buildScriptTag = function () {
            var countainer = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]),
                script = document.createElement('script'),
                deferred = $q.defer(),
                callback = function () {
                    deferred.resolve();
                }
                ;

            // Configure the script tag
            script.type = 'text/javascript';
            script.async = true;
            script.src = '//js.maxmind.com/js/apis/geoip2/v2.1/geoip2.js';
            script.onload = callback;

            countainer.appendChild(script);

            return deferred.promise;
        };

        /**
         * Init script
         * Return a promise
         */
        this.init = function () {
            var deferred = $q.defer();

            if (!ready) {
                this.buildScriptTag().then(
                    function () {
                        ready = true;
                        deferred.resolve();
                    }
                );
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };

        /**
         * Get country
         */
        this.getCountry = function () {
            var deferred = $q.defer();

            //init and get reply
            this.init().then(
                function () {

                    geoip2.country(
                        function (res) {
                            deferred.resolve(res);
                        },
                        function (res) {
                            deferred.reject(res);
                        }
                    );
                }
            );
            return deferred.promise;
        };

        /**
         * Get city
         */
        this.getCity = function () {
            var deferred = $q.defer();

            //init and get reply
            this.init().then(
                function () {

                    geoip2.city(
                        function (res) {
                            deferred.resolve(res);
                        },
                        function (res) {
                            deferred.reject(res);
                        }
                    );
                }
            );
            return deferred.promise;
        };

        /**
         * Get countries
         * @returns {instance.$promise|*|$promise|Array.$promise|A.$promise|E.$promise}
         */
        this.getCountries = function () {
            return LocationRepository.getCountries().$promise;
        };

    }
);
