angular.module('app.home')
    .directive('cookiesNotification',
    function ($log, $http, $localStorage) {
        return {
            scope: {
                policyLink: '@'
            },
            template:
            '<div ng-show="show" class="navbar-default navbar navbar-notification text-center small-font background-gray-darkest color-brand-white">'+
                '<span class="navbar-notification-info inline-block sans-serif">By continuing to use this site, you agree to the use of cookies. <a class="inherit-color text-underline" href="{[{ policyLink }]}">Find out more</a>.</span><a class="navbar-notification-close pull-right hover-keep-color inherit-color" href="#" ng-click="closeCookies()"><i class="icon-close" aria-hidden="true"></i></a>'+
            '</div>',
            replace: true,
            transclude: true,
            restrict: 'E',
            link: function cookies(scope, element, attrs) {
                scope.$storage = $localStorage;
                scope.element = element;
                scope.show = true;

                if(scope.$storage.acceptedCookies) {
                    scope.show = false;
                }

                scope.closeCookies = function() {
                    scope.$storage.acceptedCookies = true;
                    scope.show = false;
                };

            }
        };
    }
);
