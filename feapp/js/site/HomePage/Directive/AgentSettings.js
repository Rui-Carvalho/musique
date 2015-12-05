angular.module('app.home')
    .directive('agentSettings',
    function ($log, AgentService) {
        return {
            scope: {},
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                var
                    classList = [],
                    classConcat,
                    ngElm = angular.element(element)
                    ;

                // agents classes conditions
                if (AgentService.isTouch()) {
                    classList.push('touchscreen');
                }
                else {
                    classList.push('desktop');
                }

                if (AgentService.isIE()) {
                    classList.push('browser_ie');
                }

                classConcat = classList.join(' ');

                ngElm.addClass(classConcat);
            }
        };
    }
);
