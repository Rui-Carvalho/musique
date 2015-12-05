angular.module('app.core')
    .service('stickyHeaderManager',
    function ($log, DomService, ArrayService) {
        'use strict';

        this.stoppers = [];
        this.containers = [];
        this.zindex = 1000;

        /**
         * Add stopper or replace
         * @param id
         * @param ref
         */
        this.addStopperIfUnique = function (id, ref) {
            var selected = ArrayService.select(this.stoppers, 'id', id);
            if (!selected) {
                this.stoppers.push({id: id, ref: ref});
                $log.debug('Adding stopper:' + id);
            } else {
                selected.ref = ref;
            }
        };

        /**
         * Add new stopper
         * @param id
         * @param ref
         */
        this.addStopper = function (id, ref) {
            // if id is not defined attach to previous container
            if (!id) {
                var prev = this.getLastContainer();
                if (prev) {
                    this.addStopperIfUnique(prev.id, ref);
                }
            } else {
                this.addStopperIfUnique(id, ref);
            }
        };

        /**
         * Get Stopper
         * @param id
         * @param height
         * @returns {*}
         */
        this.getStopper = function (id, height) {
            var selected = null;
            angular.forEach(this.stoppers, function (i) {
                if (i.id === id) {
                    if (DomService.getTop(i.ref) < height) {
                        selected = DomService.getAbsoluteTop(i.ref);
                        //$log.debug('Stopper at:' + selected);
                        return false;
                    }
                }
            });
            return selected;
        };

        /**
         * Add to container array and add it as a stopper
         * @param id
         * @param ref
         */
        this.addContainer = function (id, ref) {
            var prev = this.getLastContainer(),
                selected = ArrayService.select(this.containers, 'id', id);

            //// if previous container detected add a stopper to it
            //if (prev) {
            //    this.addStopperIfUnique(prev.id, ref);
            //}

            // if container id is new add to container or replace
            if (!selected) {
                this.containers.push({id: id, ref: ref});
                $log.debug('Adding container:' + id);
            } else {
                selected.ref = ref;
            }
        };

        /**
         * Get Last Container
         * @returns {T}
         */
        this.getLastContainer = function () {
            return this.containers.slice(-1)[0];
        };

        /**
         * Generate unique Id
         * @returns {string}
         */
        this.generateContainerId = function () {
            return 'container-' + this.containers.length;
        };

        /**
         * Prevent zindex conflicts
         * @returns {number}
         */
        this.getZIndex = function () {
            this.zindex -= 1;
            return this.zindex;
        };
    }
)
;
