angular.module('app.search')
    .service('SearchService',
    function (DataService, SearchApi) {
        // extend class
        var self = this,
            defaultFilters = {
                limit: 2,
                offset: 0
            };


        /**
         * Home page read more
         * @param email
         * @returns {*}
         */
        self.getAll = function (filters, removePrefix) {
            filters = DataService.createFilters(defaultFilters, filters);

            return SearchApi.getAll(filters)
                .$promise
                .then(
                function (res) {
                    res.data = DataService.normalise(res.data, removePrefix);
                    return res;
                }
            );
        };
    }
);
