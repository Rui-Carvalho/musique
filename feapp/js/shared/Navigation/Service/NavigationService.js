angular.module('app.nav')
    .factory('NavigationManager', function (DomService, EventManager) {
        'use strict';

        var body = DomService.getBody(),
            eventName = 'NavigationChange',
            navigationEventManager = EventManager.get(eventName);

        function Factory() {
            this.listeners = [];
            this.containers = {
                main: false,
                user: false
            };

            this.onChange = function (listener) {
                return navigationEventManager.addListener(listener);
            };
            this.setValue = function (container, value) {
                navigationEventManager.emit(
                    {
                        container: container,
                        value: value
                    }
                );

                this.containers[container] = value;
            };
            this.toggle = function (container) {
                this.setValue(container, !this.containers[container]);
            };
            this.closeAll = function () {
                var self = this;

                angular.forEach(this.containers, function (v, container) {
                    self.setValue(container, false);
                });
            };
        }

        return new Factory();
    })
;
