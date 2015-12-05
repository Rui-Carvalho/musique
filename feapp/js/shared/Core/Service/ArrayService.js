angular.module('app.core')
    .service('ArrayService',
    function ($log, DateService) {
        'use strict';

        /**
         * Linear Range
         * @param n iterations
         * @param steps
         * @param start
         * @returns {Array}
         */
        this.range = function (n, steps, start) {
            var results = [];
            for (var i = start; i <= n * steps; i += steps) {
                results.push(i);
            }
            return results;
        };

        /**
         * Generate date list
         * @param  n
         * @param  skipWeekends
         * @return {Array}
         */
        this.dateRange = function (n, skipWeekends) {
            var i = 0,
                results = [],
                date = new Date(),
                cnt = 0,
                day = 86400000,
                base = date.getTime();
            while (i < n) {
                date = new Date(base + (cnt * day));
                if (!DateService.isWeekend(date) || !skipWeekends) {
                    results.push(DateService.toString(date));
                    i += 1;
                }
                cnt += 1;
            }
            return results;
        };

        /**
         * Generate time list
         * @param  n
         * @param steps in minutes
         * @param start
         * @return {Array}
         */
        this.timeRange = function (step) {
            var results = [],
                date = new Date('2015/01/01 00:00:00'),
                toDate = new Date('2015/01/02 00:00:00'),
                base = date.getTime(),
                cnt = 0
                ;

            // convert in seconds
            step = step * 60 * 1000;

            while (date <= toDate) {
                results.push({
                    label: DateService.toTimeString(date),
                    value: cnt * step
                });
                cnt += 1;
                date = new Date(base + (cnt * step));
            }
            return results;
        };

        /**
         * Pow Range
         * @param base pow base
         * @param i start
         * @param max cap
         * @returns {Array}
         */
        this.rangePow = function (base, i, max) {
            var results = [],
                n = 0;
            while (n < max) {
                n = Math.floor(Math.pow(base, i));
                results.push(n);
                i += 1;
            }
            return results;
        };

        /*
         * Remove item from array
         */
        this.remove = function (items, item) {
            var index = null;
            angular.forEach(items,
                function (i, x) {
                    if (i.$$hashKey === item.$$hashKey) {
                        index = x;
                        return false;
                    }

                }
            );

            // remove element
            if (index >= 0) {
                items.splice(index, 1);
            }
        };

        /**
         * Replace values by key
         */
        this.replace = function (original, replace) {
            // loop array
            angular.forEach(original, function (o) {
                // replace object value
                angular.forEach(replace, function (val, key) {
                    o[key] = val;
                });
            });
        };

        /**
         * Select and return reference
         * @param items
         * @param key
         * @param value
         * @returns {boolean}
         */
        this.select = function (items, key, value) {
            var selected = null;
            angular.forEach(items, function (item) {
                if (item[key] === value) {
                    selected = item;
                    return false;
                }
            });
            return selected;
        };

        /**
         * Return copy of filtered object collection
         * @param items
         * @param key
         * @param value
         * @param returnCopy
         * @returns {*}
         */
        this.selectAll  = function (items, key, value) {
            return items
                .filter(
                function (item) {
                    return item[key] === value;
                }
            );
        };

        /**
         * Extract key
         */
        this.extract = function (items, key) {
            //var response = [];
            //angular.forEach(items, function (item) {
            //    response.push(item[key]);
            //});
            //return response;

            return items
                .map(
                function (item) {
                    return item[key];
                }
            );
        };

        /**
         * Check if element is already present into an array
         * @param items
         * @param key
         * @param value
         * @returns {boolean}
         */
        this.exists = function (items, key, value) {
            var exists = false;
            angular.forEach(items, function (item) {
                if (item[key] === value) {
                    exists = true;
                    return false;
                }
            });
            return exists;
        };

        /**
         * Check if item in array
         * @param items
         * @param item
         * @returns {boolean}
         */
        this.inArray = function (items, item) {
            return items.indexOf(item) !== -1;
        };

        /**
         * Limit data
         *
         * @param items
         * @param limit
         * @returns {*}
         */
        this.limit = function (items, limit) {
            return items.splice(0, limit);
        };

    }
);
