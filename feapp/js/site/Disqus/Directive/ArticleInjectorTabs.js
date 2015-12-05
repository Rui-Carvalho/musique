angular.module('app.disqus')
.directive('articleInjectorTabs',
    function (EventManager, $location, $timeout) {
        'use strict';

        return {
            template: '<div><tabset><tab ng-repeat="tab in tabs" ng-click="switchTab(tab)" heading="{{ tab.title }}" active="tab.active"></tab></tabset></div>',
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                url: '@',
                title: '@'
            },

            link: function (scope, element, attrs) {
                scope.active = false;

                // default discussion
                var discussion = {
                    active: false,
                    title: scope.title,
                    url: scope.url
                };
                scope.tabs = [discussion];

                scope.switchTab = function (data) {
                    EventManager.emit('disqusThreadSwitch', data);
                };

                EventManager.on('articleInjectChange', function (data) {
                
                    // force active status
                    discussion.active = false;
                    data.active = true;

                    // update tabs
                    scope.tabs[1] = data;

                    // refresh disqus
                    scope.switchTab(data);
                });
            }
        };
    }
)
;
