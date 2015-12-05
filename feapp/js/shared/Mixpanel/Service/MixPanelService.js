// https://mixpanel.com/help/reference/javascript-full-api-reference

angular.module('app.mixpanel')
    .service('MixpanelService',
    function ($window, $timeout, StringService) {
        'use strict';

        // vars
        this.user = null;
        this.events = [];
        this.timer = null;

        var self = this,
            omitKeys = [
                'Payload'
            ];

        this.identify = function (user) {
            this.user = user;
            if (this.user.id) {
                this.user = this.remapMixPanelData(this.user);
            }
            this.lazyFlush();
        };

        //remap data
        this.remapMixPanelData = function (data) {
            var res = {},
                lookup = {
                    'EntityId': 'Entity ID',
                    'EntityName': 'Entity Name',
                    'EntityType': 'Entity Type',
                    'PageTitle': 'Page Title',
                    'ShareType': 'Share Type',
                    'Url': 'URL',
                    'id': 'id', //do not change id
                    'display': 'User’s Name'
                    //'email': '$email',
                    //'display': '$name'
                };
            angular.forEach(data, function (val, key) {
                if (lookup.hasOwnProperty(key)) {
                    res[lookup[key]] = val;
                } else {
                    res[StringService.capitalize(key)] = val;
                }
            });

            // adding url
            res.URL = $window.location.pathname;

            return res;
        };

        this.addEvent = function (data, immediateFlush) {
            var remappedData = this.remapMixPanelData(data);
            this.events.push(remappedData);

            // trigger flush
            if (!immediateFlush) {
                this.lazyFlush();
            } else {
                this.flush();
            }
        };

        this.lazyFlush = function () {
            $timeout.cancel(this.timer);

            this.timer = $timeout(function () {
                    self.flush();
                },
                300
            );
        };

        this.flush = function () {
            if ($window.mixpanel) {

                // identify user
                if (this.user) {

                    if (this.user.id) {
                        $window.mixpanel.identify(this.user.id);

                        // people API
                        // $window.mixpanel.people.set(this.user);
                        $window.mixpanel.register(
                            _.omit(
                                _.clone(
                                    this.user
                                ),
                                omitKeys
                            )
                        );
                    } else {
                        $window.mixpanel.identify(false);
                        $window.mixpanel.unregister('Email');
                    }

                    // lock command execution
                    this.user = null;
                }

                //
                angular.forEach(this.events, function(e){
                    $window.mixpanel.track(e.Event, e);
                });

                //empty array
                this.events = [];

            } else {
                this.lazyFlush();
            }
        };

    }
);
