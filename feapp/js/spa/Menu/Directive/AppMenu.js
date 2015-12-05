angular.module('app.menu')
.directive('appMenu',
function (EventManager, UiEvents, NavigationManager, AuthEvents, MenuEvents, AgentService) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            legacy: '@',
            name: '@'
        },
        replace: true,
        templateUrl: '/templates/Spa/Navigation:app_navigation',
        link: function (scope, element, attrs) {
            scope.user = {};
            scope.open = false; // is used to switch content mobile and tablet/desktop navigation
            scope.company = {};
            scope.dropdownSelected = null;

            // stop event bubling on component
            element.on('click',function(event){
                event.stopPropagation();
            });

            scope.toogleDropDown = function (n) {
                if (scope.dropdownSelected == n) {
                    scope.dropdownSelected = null;
                }
                else {
                    scope.dropdownSelected = n;
                }
            };

            NavigationManager.onChange(
                function (data) {
                    if (data.container === scope.name && !AgentService.isMobile()) {
                        scope.open = data.value;
                    } else { // prevent content switching because you can see the desktop content when you close the nav
                        scope.open = true;
                    }
                }
            );

            EventManager.on(
                UiEvents.WINDOW_CLICK,
                function(user) {
                    scope.toogleDropDown(null);
                }
            );

            EventManager.on(
                AuthEvents.USER_CHANGED,
                function (user) {
                    scope.user = user;
                }
            );

            // listen for company change
            EventManager.on(
                AuthEvents.COMPANY_CHANGED,
                function (res) {
                    scope.company = res.company;
                }
            );

        }
    };
});