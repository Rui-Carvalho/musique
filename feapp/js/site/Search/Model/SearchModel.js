angular.module('app.search')
    .factory('SearchApi',
    function ($resource, CacheService) {
        'use strict';

        var cacheFactory = CacheService.shortCache('searchCache');

        return $resource('http://search.businessoffashion.com/api/complete',
            {
                id: '@id'
            },
            {
                getAll: {
                    method: 'GET',
                    cache: cacheFactory
                }
            }
        );
    }
)
;
