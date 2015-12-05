angular.module('app.core')
    .directive('sectionLoader', [
        function () {
            return {
                template: '<div class="section-loader"><div ng-show="show" class="animate-fade loader glyphicon glyphicon-refresh"></div><div class="content" ng-class="{loading: show}" ng-transclude></div></div>',
                replace: true,
                restrict: 'E',
                transclude: true,
                scope: {
                    show: '='
                },
                link: function (scope, element, attrs) {
                }
            };
        }
    ]);
