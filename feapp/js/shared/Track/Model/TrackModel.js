angular.module('app.track')
.factory('TrackApi',
    function ($resource, CacheService, DataService) {
        'use strict';

        // var cacheFactory = CacheService.shortCache('articleCache');

        return $resource('/xhr/track/event',
            {
                // id: '@id'
            },
            {
                // emit: {
                //     headers: { 'Content-Type': 'form-data' },
                //     method: 'POST',
                //     transformRequest: function(data){
				// 		return DataService.transformRequest(data);
				// 	},
                // }
            }
        );
    }
)
;
