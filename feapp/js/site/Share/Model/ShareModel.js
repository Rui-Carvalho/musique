angular.module('app.share')
    .factory('ShareApi',
    function ($resource, CacheService) {
        'use strict';

        // var cacheFactory = CacheService.shortCache('ShareCache');

        return $resource('/xhr/messages/:action',
            {
                action: '@action'
            },
            {
                share: {
                    params: {
                        action: 'send_to_friend'
                    },
                    method: 'POST'
                },
                generic: {
                    params: {
                        action: 'submit'
                    },
                    method: 'POST'
                }
            }
        );
    }
)
;
