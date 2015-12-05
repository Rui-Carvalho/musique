angular.module('app.core')
.service('ChannelManager',
    function ($log, $timeout, EventDispatcher) {
        'use strict';

        var channels = [];

        this.get = function (name) {
            var channel = null;

            if (channels.hasOwnProperty(name)) {
                channel = channels[name];
            } else {
                channel = new EventDispatcher();
                channels[name] = channel;
            }

            return channel;
        };

        this.subscribe = function (name) {
            return this.get(name);
        };

        this.destroy = function (name) {
            var channel = this.get(name);

            if (channel) {
                channel.destroy();
            }
        };

    }
)
;
