angular.module('app.location')
    .directive('selectCountry',
    function (LocationService, ArrayService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                modelCountryId: '=',
                modelCityId: '=',
                name: '@'
            },
            replace: true,
            template: '<div><select ng-change="setCity()" ng-model="model" name="{[{name}]}" form-control class="form-control" required ng-options="item.name for item in countries"><option value="">Location</option></select></div>',
            link: function (scope, element) {

                // add selected attribute
                var selected = {
                    country: {
                        iso_code: ''
                    }
                };
                scope.countries = [];
                scope.model = null;

                scope.setCity = function () {

                    // check if selection is different from the suggested
                    if (selected.country.iso_code.toLowerCase() === scope.model.code) {
                        if (selected.city) {
                            scope.modelCityId = selected.city.names.en;
                        } else {
                            scope.modelCityId = '';
                        }
                    } else {
                        scope.modelCityId = '';
                    }

                    // copy to models
                    scope.modelCountryId = scope.model.id;

                };

                // get countries and then preselect current one
                LocationService.getCountries()
                    .then(
                        function (res) {
                            scope.countries = res.data;

                            return res;
                        }
                    )
                    .then(
                        function (res) {
                            if (!scope.modelCountryId) {
                                LocationService.getCity()
                                .then(
                                    function (res) {
                                        if (res.country) {
                                            // save selected
                                            selected = res;
                                            // preselect option
                                            scope.model = ArrayService.select(scope.countries, 'code', res.country.iso_code.toLowerCase());
                                            scope.setCity();
                                        }
                                    }
                                );
                            } else {
                                scope.model = ArrayService.select(scope.countries, 'id', String(scope.modelCountryId)); // tell me why the id has to be a string!!!!
                            }
                        }
                    );


            }
        };
    }
)
;
