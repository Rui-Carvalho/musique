angular.module('app.core')
.directive('embeddableCode', function($timeout, DomService) {
    'use strict';

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<input ng-click="selectText()" class="form-control" value="{[{ value }]}" type="text" autocapitalize="off" autocorrect="off" autocomplete="off"/>',
        scope: {
            isolate: '@'
        },
        link : function(scope, element, attrs, controller, transclude) {
            var
            domElement = element[0],
            domEmbeddableCode = transclude();

            scope.value = DomService.DOMtoString(domEmbeddableCode);

            scope.selectText = function () {
                domElement.select();
            };

            // avoid input editing
            element.bind('keypress', function(e) {
                e.preventDefault();
            });
        }
    };
});