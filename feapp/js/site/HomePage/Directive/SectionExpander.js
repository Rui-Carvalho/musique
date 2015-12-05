angular.module('app.home')
    .directive('sectionExpander',
    function ($localStorage) {
        return {
            template: '<div class="container section-expander padded">' +
                            '<div class="col-sm-24">' +
                                '<div class="row relative header text-center">' +
                                    '<i ng-click="toggle()" class="large-font pull-left" ng-class="{\'icon-circle-arrow\': collapsed, \'icon-circle-arrow icon-rotate-180\': !collapsed}"></i>' +
                                    '<a ng-if="titleLink" class="hover-no-underline" href="{[{titleLink}]}"><h2 class="no-top-margin heavy-font offset-bottom-small">{[{title}]} <span class="h4 icon-large-arrow" style="position:relative;top:-4px;"></span></h2><p>{[{subtitle}]}</p></a>' +
                                    '<div ng-if="!titleLink"><i ng-click="toggle()" class="large-font pull-left" ng-class="{\'icon-circle-arrow\': collapsed, \'icon-circle-arrow icon-rotate-180\': !collapsed}"></i>' +
                                        '<h2 class="no-top-margin offset-bottom-half">{[{title}]} <span class="h4 icon-large-arrow" style="position:relative;top:-4px;"></span></h2><h5>{[{subtitle}]}</h5>' +
                                    '</div>'+
                                '</div>' +
                                '<div class="row content" ng-class="{collapsed: collapsed}" ng-transclude></div>' +
                          '</div>' +
                      '</div>',
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                title: '@',
                subtitle: '@',
                sponsor: '@',
                titleLink: '@'
            },
            link: function (scope, element, attrs) {
                scope.collapsed = $localStorage[scope.id] !== undefined ? $localStorage[scope.id] : false;

                scope.toggle = function () {
                    scope.collapsed = !scope.collapsed;
                    $localStorage[scope.id] = scope.collapsed;
                };

            }
        };
    }
)
;
