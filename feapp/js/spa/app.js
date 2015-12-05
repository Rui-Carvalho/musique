angular.module('app', angularModules)
.constant('GlobalParameters',
    {
        OpenrossHost: window.OpenrossHost,
        FilePreviews: window.FilePreviews || 'tfYlHlMuajKi1ml2VaFtb4aFkiMC1R'
    }
)
.config(
    function ($interpolateProvider, $locationProvider, $compileProvider, $logProvider, $provide, CryptServiceProvider, $stateProvider, $urlRouterProvider, $httpProvider, UiPrefetchServiceProvider) {
        'use strict';

        // do not touch/remove here !!!!
        var DEV = true;
        $logProvider.debugEnabled(DEV);
        $compileProvider.debugInfoEnabled(DEV);
        UiPrefetchServiceProvider.enabled(!DEV);
        // do not touch/remove here !!!!

        // needed to avoid Twig conflicts
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

        // $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(false);

        $provide.decorator('satellizer.storage',
            function ($delegate, store) {
                $delegate = store;
                return $delegate;
            }
        );

        CryptServiceProvider.setSecret('59fa99da933506a84588f1739df157d4');

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/app/home");

        // Now set up the states
        $stateProvider
		.state('app', {
			url:'/app',
			templateUrl: '/templates/Spa/Layouts:side_body/'
		})
        .state('app.home', {
            url:'/home',
            templateUrl: '/templates/Spa/Home:home_template/'
        })
        ;

        // if API requires a different user intercept it and redirect to home, emits PermissionEvents.DENIED
        $httpProvider.interceptors.push('PermissionInterceptor');
        $httpProvider.interceptors.push('AuthSignatureInterceptor');

    }
)
.run(
    function (UserService, EventManager, PermissionEvents, $state, AuthEvents, UrlService) {
        'use strict';
        // get from JWT token, passing true will cause AuthService to emit userDataChanged event
        UserService.getCurrent(true, true);

        // manage access denied from BE
        EventManager.on(
            PermissionEvents.DENIED,
            function () {
                $state.go('app.home');
            }
        );

        EventManager.on(
            AuthEvents.USER_CHANGED,
            function (user) {
                if (_.isEmpty(user)) {
                    // redirect
                    UrlService.gotoHomepage();
                }
            }
        );

        // @TODO implement token refresh

    }
)
;
