angular.module('app.track')
    .service('TrackService',
    function ($window, $location, TrackApi, $timeout, EventManager, $q, UserService) {
        'use strict';

        this.events = [];
        this.timer = null;

        // add event to queue to be sent later
        this.addEvent = function (data) {
            $window.dataLayer.push(data);
            this.events.push(this.remapEvent(data));

            this.lazyCommit();
        };

        // emit single event and flush immediately
        this.emitEvent = function (data) {
            this.addEvent(data);
            return this.flushAll();
        };

        // auto commit collected events
        this.lazyCommit = function () {
            if (this.timer) {
                $timeout.cancel(this.timer);
            }

            var self = this;
            this.timer = $timeout(function () {
                self.flushAll();
            }, 500);
        };

        // remap single event
        this.remapEvent = function (data) {
            return {
                e: data.event,
                id: data.value,
                ctx: ''
            };
        };

        // Send data to internal API
        // return promise
        this.flushAll = function () {
            var user = UserService.getCurrent();

            if (this.timer) {
                $timeout.cancel(this.timer);
            }

            // post events and clear queue when done
            var self = this,
                deferred = $q.defer(),
                promise = deferred.promise;


            if (user.id) {
                // internal tracking
                var entity = new TrackApi();

                // create entity
                angular.extend(entity, {
                    platform: 1, // en platform
                    language: 1,
                    events: self.events,
                    user_id: user.id
                });

                // return promise
                promise = entity.$save()
                    .then(
                    function (res) {
                        // clean queue
                        self.events = [];
                        return res;
                    },
                    function () {
                        return false;
                    }
                );
            } else {
                deferred.reject();
            }

            return promise;
        };

        // virtual page view
        this.pageView = function (path) {
            path = path || '';

            var url = $window.location.pathname;

            // remove / from the end
            if (url.slice(-1) === '/') {
                url = url.slice(-1);
            }

            var data = {
                event: 'virtualPage',
                category: url,
                value: url + path
            };

            $window.dataLayer.push(data);
        };

    }
);
