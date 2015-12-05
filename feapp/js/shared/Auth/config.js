angular.module('app.auth',
    [
        'angular-storage',
        'satellizer'
    ])
    .config(function ($httpProvider, $authProvider, QuerystringRouterProvider) {
        // configure satellizer, https://github.com/sahat/satellizer

        //@TODO: change https here
        $authProvider.baseUrl = 'http://' + location.host + '/xhr/auth';

        $authProvider.loginUrl = '/login';
        $authProvider.signupUrl = '/signup';

        $authProvider.authHeader = 'X-Auth-Token';

        // disable redirect
        $authProvider.loginRedirect = null;

        $authProvider.facebook({
            url: '/social/facebook',
            clientId: window.facebook_id
        });

        $authProvider.google({
            url: '/social/google',
            clientId: window.gplus_id
        });

        $authProvider.twitter({
            url: '/social/twitter',
            clientId: window.twitter_id
        });

        $authProvider.linkedin({
            url: '/social/linkedin',
            clientId: window.linkedin_id
        });

    })
    .run(function (EventManager, QuerystringRouter, AuthModalService, UrlService) {
        'use strict';

        QuerystringRouter
            .when('confirm_password',
                function (data) {
                    AuthModalService.openConfirmPassword(data);
                }
            )
            .when('confirm_account',
                function (data) {
                    AuthModalService.openActivateAccount(data);
                }
            )
            .when('campaign_signup',
                function (data) {
                    AuthModalService.setSubscribeSource('Direct');
                    AuthModalService.openSignup('campaign_signup', data);
                }
            )
            .when('company_signup',
                function (data) {
                    AuthModalService.setSubscribeSource('Direct');
                    AuthModalService.openSignup('company_signup', data);
                }
            )
            .when('call_ins',
                function (data) {
                    AuthModalService.setSubscribeSource('CallIns');
                    AuthModalService.openSignup('call_ins', data, true, true, true, true);
                }
            )
            .when('login',
                function (data) {
                    AuthModalService.openLogin('default', data).then(
                        function (res) {
                            if (data.referer) {
                                UrlService.changeUrl(data.referer);
                            }
                        }
                    );
                }
            )
            .when('signup',
                function (data) {
                    AuthModalService.setSubscribeSource('Direct');
                    // After signup we dont redirect anywhere, we only close the modal
                    AuthModalService.openSignup('default', data);
                }
            )
            .init()
        ;
    })
;
