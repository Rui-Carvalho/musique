angular.module('app.auth')
    .factory('AuthApi',
    function ($resource, $location) {
        'use strict';

        //@TODO: change https here
        return $resource('http://' + $location.host() + '/xhr/auth/:action',
            {
                action: '@action'
            },
            {
                requestPassword: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'resetpassword'
                    }
                },
                changePassword: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'confirmpassword'
                    }
                },
                logout: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'logout'
                    }
                },
                signup: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'signup'
                    }
                },
                refresh: {
                    method: 'POST',
                    cache: false,
                    params: {
                        action: 'refresh'
                    }
                },
            }
        );
    }
)
;
