angular.module('app.core')
.factory('EventDispatcher',
    function ($log, $timeout) {
        'use strict';

        /**
         * Event Dispatcher class, this is only for one Event
         */
        function Dispatcher(name) {

            var self = this,
                listeners = [],
                canEmit = true,
                ttl = null,
                lastEvent = null
                ;

            /**
             * Add new event listener
             * @param listener
             */
            this.addListener = function (listener) {
                listeners.push(listener);
                var index = listeners.length - 1;

                // dispatch if event already recorder
                if (lastEvent) {
                    this.dispatch(listener, lastEvent);
                }

                // return function to remove listener
                return function () {
                    self.removeListener(index);
                };
            };

            /**
             * Dispatch message
             * @param listener
             * @param event
             */
            this.dispatch = function (listener, event) {
                try {
                    // callback
                    listener(event);
                } catch (e) {
                    // disable listener
                    $log.error('EventDispatcher:', e);
                    listener = null;
                }
            };

            /**
             * Emit event to listeners
             * @param event
             */
            this.emit = function (event) {
                // check it flood preventer is set
                if (canEmit) {

                    if (ttl) {
                        canEmit = false;
                        $timeout(
                            function () {
                                canEmit = true;
                            },
                            ttl
                        );
                    }

                    // save event
                    lastEvent = event;

                    // loop
                    angular.forEach(listeners,
                        function (listener) {
                            if (listener) {
                                // try to dispatch data
                                self.dispatch(listener, event);
                            }
                        }
                    );
                } else {
                    // flood preventer post action here
                }
            };

            /**
             * Set flood preventer
             */
            this.setTick = function (value) {
                ttl = value;
            };

            /**
             * Remove listeners
             * @param  {Number} index
             */
            this.removeListener = function (index) {
                delete listeners[index];
            };

            /**
            * Remove all listeners references
            */
            this.removeAll = function () {
                listeners = [];
            };
        }

        /**
         * Dispatcher factory, manage multiple Events
         */
        function EventFactory() {
            var dispatchers = {};

            /**
             * Internal function to get or create new
             * @param  {String} name
             * @return {Dispatcher}
             */
            this.get = function (name) {
                var dispatcher = null;

                if (dispatchers.hasOwnProperty(name)) {
                    dispatcher = dispatchers[name];
                } else {
                    dispatcher = new Dispatcher(name);
                    dispatchers[name] = dispatcher;
                }

                return dispatcher;
            };

            /**
             * Set maximum TTL
             * @param  {String} name
             * @param  {Number} ttl
             */
            this.tick = function (name, ttl) {
                var dispatcher = this.get(name);
                dispatcher.setTick(ttl);
            };

            /**
             * Subscibe to Event
             * @param  {String} name
             * @param  {Function} listener
             */
            this.on = function (name, listener) {
                var dispatcher = this.get(name);
                return dispatcher.addListener(listener);
            };

            /**
             * Emit Event
             * @param  {String} name
             * @param  {Object} data
             * @param  {Boolean} copyData enable in order to safe copy data
             */
            this.emit = function (name, data, copyData) {
                var dispatcher = this.get(name);
                dispatcher.emit(copyData ? angular.copy(data) : data);
            };

            /**
             * Remove Event Listener
             * @param  {String} name
             * @param  {Number} index
             */
            this.remove = function (name, identifier) {
                var dispatcher = this.get(name);
                dispatcher.removeListener(identifier);
            };

            /**
            * Destroy all references
            */
            this.destroy = function () {
                // remove all listeners from each Event
                angular.forEach(dispatchers,
                    function (dispatcher, dispatcherName) {
                        dispatcher.removeAll();
                    }
                );
                dispatchers  = {};
            };
        }

        return EventFactory;

    }
)
/**
Using a Global Channel, if you need an isolated one use ChannelManager
*/
.factory('EventManager',
    function (EventDispatcher) {
        return new EventDispatcher();
    }
)
;
