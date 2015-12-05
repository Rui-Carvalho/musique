angular.module('app.auth')
    .directive('modalOpenBackDrop',
    function (EventManager, AgentService, DomService, AuthEvents) {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var backDrop = angular.element(element[0]),
                    parentNode = DomService.getHtmlTag()
                    ;

                EventManager.on(AuthEvents.PROTECT_CONTENT, function (data) {
                    if (data.status) {
                        backDrop.addClass('modal-drop');
                        parentNode.addClass('freeze-page');
                    } else {
                        backDrop.removeClass('modal-drop');
                        parentNode.removeClass('freeze-page');
                    }
                });
            }
        };
    }
)
;
