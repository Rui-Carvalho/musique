angular.module('app.core')
    .service('CacheService',
    function ($log, CacheFactory) {
        'use strict';

        function Factory() {
            this.shortCache = function (model) {
                return this.buildCache(model, 5, 8);
            };

            this.volativeCache = function (model) {
                return this.buildCache(model, 1, 5);
            };

            this.longCache = function (model) {
                return this.buildCache(model, 720, 8);
            };

            this.monthCache = function(model) {
                return this.buildCache(model, 60 * 24 * 30, 1);
            };

            this.buildCache = function (model, mins, capacity) {
                var factory = CacheFactory;
                return factory(model, {
                    maxAge: 1000 * 60 * mins,
                    cacheFlushInterval: 1000 * 60 * 60,
                    deleteOnExpire: 'aggressive',
                    storageMode: 'localStorage',
                    capacity: capacity
                });
            };

            this.destroy = function (model) {
               var cache =  CacheFactory.get(model);
                cache.destroy();
            };
        }

        return new Factory();

    });
