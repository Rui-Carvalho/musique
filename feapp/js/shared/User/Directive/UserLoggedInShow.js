angular.module('app.user')
    .directive('userLoggedInShow',
    function (EventManager, AuthEvents) {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var negate = attrs.negate === 'true' ? true : false,
                    elementRef = angular.element(element)
                    ;

                EventManager.on(AuthEvents.USER_CHANGED, function (user) {
                    if (user.id ^ negate) {
                        elementRef.addClass('hide');
                    } else {
                        elementRef.removeClass('hide');
                    }
                });

            }
        };
    }
)

;
