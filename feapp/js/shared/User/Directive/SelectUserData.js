angular.module('app.user')

    .directive('selectUserData',
    function (UserService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                modelId: '=',
                modelLabel: '=',
                name: '@',
                placeholder: '@'
            },
            replace: true,
            transclude: true,
            template: '<div><input type="text" name="{[{name}]}" ng-model="model" placeholder="{[{placeholder}]}" class="form-control form-control" typeahead="item as item.label for item in getSuggestions($viewValue)" typeahead-focus-first="false" typeahead-on-select="handleSelection($item, $model, $label)" class="form-control" ng-keyup="handleKeyUp($event)" typeahead-wait-ms="300" form-control ng-minlength="2" required/></div>',
            link: function (scope, element) {

                // add selected attribute
                var selected = [];
                scope.model = scope.modelLabel;

                /**
                 * Typeahead
                 * @param query
                 * @returns {*|Function|promise|n|O|s}
                 */
                scope.getSuggestions = function (query) {
                    return UserService.getDataSuggestions(scope.name, query)
                        .then(
                        function (res) {
                            if(_.isEmpty(res)) {
                                scope.modelId = 0;
                            }
                            return res;
                        }
                    );
                };

                /**
                 * Handle data on select
                 */
                scope.handleSelection = function (item, model, label) {
                    if (model) {
                        scope.modelId = model.id;
                        scope.modelLabel = model.label;
                    }
                };

                scope.handleKeyUp = function (event) {
                    if (!angular.isObject(scope.model)) {
                        scope.modelLabel = scope.model;
                        scope.modelId = 0;
                    }
                };

            }
        };
    }
)
;
