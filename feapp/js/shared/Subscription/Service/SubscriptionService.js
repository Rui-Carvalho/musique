angular.module('app.subscription')
    .service('SubscriptionService',
    function (SubscriptionApi, CacheService, $q, EventManager, SubscriptionEvents, SubscriptionCaches) {
        'use strict';

        var self = this,
            cache = CacheService.longCache(SubscriptionCaches.SUBSCRIPTION_CACHE)
            ;

        /**
         * update status by calling api
         * @param id
         * @param status
         * @returns {*}
         */
        this.update = function (id, status) {
            // change here the call
            var action = status ? SubscriptionApi.subscribe : SubscriptionApi.unsubscribe;

            return action(
                {
                    profiles: [id] // we have to update une profile at time
                })
                .$promise
                .then(
                    function (res) {
                        cache.put(SubscriptionCaches.SUBSCRIPTION_DATA_KEY, res.data.profiles);
                        EventManager.emit(
                            SubscriptionEvents.SUBSCRIPTION_CHANGED,
                            res.data.profiles
                        );
                        return res.data.profiles;
                    }
            );
        };

        /**
         * get all data from cache first and then API
         * @returns {*}
         */
        this.init = function () {
            // try to get from the cache
            var profiles = cache.get(SubscriptionCaches.SUBSCRIPTION_DATA_KEY),
                deferred = $q.defer(),
                promise = null;

            if (!profiles) {
                promise = SubscriptionApi.getAll()
                    .$promise
                    .then(
                    function (res) {
                        cache.put(SubscriptionCaches.SUBSCRIPTION_DATA_KEY, res.data.profiles);
                        return res.data.profiles;
                    }
                );
            } else {
                deferred.resolve(profiles);
                promise = deferred.promise;
            }

            // emit and return
            return promise.then(
                function (profiles) {
                    EventManager.emit(
                        SubscriptionEvents.SUBSCRIPTION_CHANGED,
                        profiles
                    );
                }
            );
        };

        /**
         * Clean subscriptions cache
         */
        this.clearCache = function () {
            cache.removeAll();
            EventManager.emit(
                SubscriptionEvents.SUBSCRIPTION_CHANGED,
                []
            );
        };

        /**
         * get all subscriptions (following profiles) from cache first and then API
         * @returns {*}
         */
        this.getAll = function (filters) {
            return SubscriptionApi.getAll(
                    _.assign(
                        { decorate: 'all' },
                        filters
                    )
                )
                .$promise;
        };
    }
)
;
