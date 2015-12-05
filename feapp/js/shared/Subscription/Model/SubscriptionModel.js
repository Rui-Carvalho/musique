angular.module('app.subscription')
    .factory('SubscriptionApi',
    function ($resource) {
        'use strict';

        return $resource('/xhr/profiles/subscriptions/:action',
            {
                action: '@action'
            },
            {
                getAll: {
                    method: 'GET',
                    cache: false, // chache in SubscriptionService
                    params: {
                    }
                },
                subscribe: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'subscribe' //set action from service
                    }
                },
                unsubscribe: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'unsubscribe' //set action from service
                    }
                },
            }
        );
    }
)
;
