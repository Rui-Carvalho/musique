angular.module('app.auth')
    .factory('UserApi',
    function ($resource, CacheService, UserCaches) {
        'use strict';

        var cacheFactory = CacheService.shortCache(UserCaches.DATA_CACHE);

        return $resource('/xhr/user/:action/:subaction',
            {
                action: '@action',
                subaction: '@subaction'
            },
            {
                resetPassword: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'resetpassword'
                    }
                },
                confirmPassword: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'confirmpassword'
                    }
                },
                activateAccount: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'confirmaccount'
                    }
                },
                getDataSuggestions: {
                    method: 'GET',
                    cache: cacheFactory,
                    params: {
                        //action: 'companies', //set from service
                        subaction: 'suggest'
                    }
                }
            }
        );
    }
)
;
