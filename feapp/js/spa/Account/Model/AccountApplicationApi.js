angular.module('app.account')
.factory('AccountApplicationApi',
    function ($resource) {
        'use strict';
        return $resource('/xhr/accounts/:userId/applications/:applicationId',
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
.factory('AccountApplicationApiFactory',
    function (AccountApplicationApi, DataService, UserService) {
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

            this.get = function (filters){
    			return AccountApplicationApi.get(
                    _.assign(
                        {
                            decorate:'job_company'
                        },
                        this.getParams(),
                        DataService.convertFilterQueryObject(filters) // it is just because there is no filter group in the BE
                    )
                )
                .$promise;
            };

            this.getOne = function (id) {
                return this.get({applicationId: id});
            };

            this.update = function (id, data) {
                return AccountApplicationApi.update(
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
