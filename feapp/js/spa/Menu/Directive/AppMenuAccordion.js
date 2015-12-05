angular.module('app.menu')
.directive('appMenuAccordion',
function (EventManager, NavigationManager, $state) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            title: '@',
            route: '@',
            open: '@',
            classIcon: '@'
        },
        replace: true,
        template: '<div><accordion-group  panel-class="panel-dark"  class="panel-accordion"  ng-class="{\'panel-inverse\': status, \'panel-transparent\': !status }" is-open="status"><accordion-heading><div class="margin-xs-5"><span class="larger-font  color-brand-white  {[{classIcon}]}  icon--reset  margin-right-xs-2  reset-line-height  valign-middle  cursor-pointer"></span><span class="text-anchor--set-2" ng-class="{\'is-active\':status}">{[{title}]}</span> <span class="pull-right inline-block text-right"> <i class="small-font  inline-block  icon-dropdown  text-right" ng-class="{\'icon-rotate-270\': !status}"></i></span></div></accordion-heading><ng-transclude/></accordion-group></div>',
        // <i class="c_notification-circle small-font  inline-block">2</i>
        transclude: true,
        link: function (scope, element, attrs) {
            scope.status = scope.open === 'true' || $state.includes(scope.route);
        }
    };
});