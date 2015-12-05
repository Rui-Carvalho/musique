angular.module('app.account')
.factory('AccountPersonalSettingsApi',
    function ($resource) {
        'use strict';
        return $resource('/xhr/accounts/:userId/personal/settings',
            {
                userId: '@userId'
            },
            {
                update: {
                    method: 'PUT'
                }
            }
        );
    }
)
.factory('AccountPersonalSettingsFactory',
    function (AccountPersonalSettingsApi, DataService, UserService) {
        'use strict';

        function Factory (params) {
            var apiParams = params;

            this.getParams = function () {
                return _.assign(
                    {
                        userId: UserService.getCurrent().id // check here
                    },
                    apiParams
                );
            };

            this.getOne = function (id) {
                return AccountPersonalSettingsApi.get(
                    this.getParams()
                );
            };

            this.update = function (id, data) {
                return AccountPersonalSettingsApi.update(
                    _.assign(
                        {},
                        this.getParams()
                    ),
                    data
                )
                .$promise;
            };
        }

        return Factory;
    }
)
;
