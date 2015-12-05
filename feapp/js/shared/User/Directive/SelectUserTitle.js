angular.module('app.user')

    .directive('selectUserTitle',
    function (UserService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                modelId: '=',
                name: '@',
                placeholder: '@'
            },
            replace: true,
            template: '<div><select class="form-control" form-control name="{[{name}]}" ng-model="model.selected" ng-options="item.label for item in itemList track by item.id" ng-change="handleChange()" required><option value="">{[{placeholder}]}</option></select></div>',
            link: function (scope, element) {
                scope.itemList = [
                    {
                        id: 'mr',
                        label: 'Mr'
                    },
                    {
                        id: 'ms',
                        label: 'Ms'
                    },
                    {
                        id: 'other',
                        label: 'Other'
                    }
                ];

                scope.model = {};

                if (scope.modelId) { // preselect
                    scope.model.selected = _.find(scope.itemList, function (item) {
                        return item.id == scope.modelId;
                    });
                }
                else {
                    scope.model.selected = null;
                }

                scope.handleChange = function () {
                    if (scope.model.selected) {
                        scope.modelId = scope.model.selected.id;
                    }
                };
            }
        };
    }
)
;
