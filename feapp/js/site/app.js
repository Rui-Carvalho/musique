angular.module('app', angularModules)
    .constant('GlobalParameters',
    {
        OpenrossHost: window.OpenrossHost
    }
)
    .config(
    function ($interpolateProvider, $locationProvider, $disqusProvider, $sceProvider, $compileProvider, $logProvider, $provide, CryptServiceProvider) {
        'use strict';

        // do not touch/remove here !!!!
        var DEV = true;
        $logProvider.debugEnabled(DEV);
        $compileProvider.debugInfoEnabled(DEV);
        // do not touch/remove here !!!!

        // needed to avoid Twig conflicts
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

        // DISQUS
        $disqusProvider.setShortname(window.developmentShortname);
        // $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(false);

        // disable routing!
        $provide.decorator('$browser',
            function ($delegate) {
                $delegate.onUrlChange = function () {
                };
                $delegate.url = function () {
                    return '';
                };
                return $delegate;
            }
        );

        $provide.decorator('satellizer.storage',
            function ($delegate, store) {
                $delegate = store;
                return $delegate;
            }
        );

        // $sceProvider.enabled(false);

        CryptServiceProvider.setSecret('59fa99da933506a84588f1739df157d4');
    }
)
    .run(
    function (UserService, PageCountService, QuerystringRouter, AuthService, AuthEvents, SubscriptionService, EventManager) {
        'use strict';
        // get from JWT token, passing true will cause AuthService to emit userDataChanged event
        UserService.getCurrent(true, true);

        PageCountService.increase();

        QuerystringRouter.init();


        // @TODO: remove it when BoF2 will be deleted
        // AuthService.tokenFromSession()
        //     .then(
        //     function () {
        //         UserService.getCurrent(true);
        //     }
        // );

        // clear chache if user is anon
        EventManager.on(
            AuthEvents.USER_CHANGED,
            function (user) {
                if (!user.id) {
                    SubscriptionService.clearCache();
                } else {
                    SubscriptionService.init();
                }
            }
        );
    }
)
;
