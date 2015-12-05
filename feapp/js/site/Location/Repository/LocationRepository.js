angular.module('app.location')
    .factory('LocationRepository',
    function ($resource, CacheService) {
        'use strict';

        var cacheFactory = CacheService.longCache('locationCache');

        //@TODO: change https here
        return $resource('/xhr/data/:action',
            {
                action: '@action'
            },
            {
                getCountries: {
                    method: 'GET',
                    cache: cacheFactory,
                    params: {
                        action: 'countries'
                    }
                }
            }
        );
    }
)
;
