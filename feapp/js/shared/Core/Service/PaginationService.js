angular.module('app.core')
    .service('PaginationService', function (moment, DateService) {
        'use strict';

        /**
         * Inject defaults values
         * @param filters
         */
        this.defaults =  function (filters) {
            filters.offset = 0;
            filters.limit = 5;
        };

        /**
         * Modify offset
         */
        this.nextPage = function (filters) {
            var newOffset = filters.offset + filters.limit;

            //if (newOffset >= 0) {
                filters.offset = newOffset;
            //}
        };

        this.prevPage = function (filters) {
            var newOffset = filters.offset - filters.limit;

            if (newOffset >= 0) {
                filters.offset = newOffset;
            }
        };

        this.setPage = function (filters, page) {
            filters.offset = filters.limit * (page - 1);
        };

        this.getPage = function (filters) {
            return filters.offset > 0 ? (filters.offset / filters.limit) + 1 : 1;
        };

        /**
         * Reset offset
         */
        this.reset = function (filters) {
            filters.offset = 0;
        };

        /**
         * Return false is items less than limit
         */
        this.isEnabled = function (filters, itemsCount) {
            return itemsCount === filters.limit;
        };

        /**
         * Get Previous date from date string 2015-01-01
         */
        this.prevDay = function (filters) {
            var date = DateService.fromString(filters.date);
            filters.date = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
        };

    }
);
