angular.module('app.user')
    .service('UserService',
    function (DataService, $q, ArrayService, AuthService, EventManager, UserApi, AuthEvents, NewsletterList, $timeout) {
        'use strict';

        var self = this,
            user = null,
            TOKEN_TIMER = 3000,
            updatedDateTime = null;

        /**
         * Return user stored into the token
         * @param emit
         * @returns {*}
         */
        this.getCurrent = function (emit, autoRefresh) {
            var payload = AuthService.getPayload();

            //set up autorefresh and propagate automatically
            if (autoRefresh && payload) {
                this.autoRefreshToken();
            }

            // emit event
            if (emit) {
                this.emitUserChanged(payload);
            }

            // return immediately
            return payload;
        };

        // please do not implement polling as car corrupt token if site is open in different tabs
        this.autoRefreshToken = function () {
            $timeout(
                function () {
                    AuthService.refresh()
                    .finally(
                        function(payload) {
                            self.emitUserChanged(payload);
                        }
                    );
                },
                TOKEN_TIMER
            );
        };

        /**
         * Emit Event only if data has changed
         * @param payload
         */
        this.emitUserChanged = function (payload) {
            if (updatedDateTime !== payload.updated_datetime) {
                updatedDateTime = payload.updated_datetime;
                EventManager.emit(AuthEvents.USER_CHANGED, payload);
            }
        };

        /**
         * Check if subscribed
         * @param user
         * @param listId
         * @returns {boolean}
         */
        this.isSubscribed = function (listIds, user) {
            if (!user) {
                user = this.getCurrent();
            }

            if (!user.subscriptions) {
                return false;
            }

            if(angular.isArray(listIds)){
                var subscribed = true;

                _.each(!listIds, function(listId) {
                    if(!angular.isNumber(listId)) {
                        listId = NewsletterList[listId];
                    }
                    if(!ArrayService.inArray(user.subscriptions, listId)) {
                        subscribed = false;
                    }
                });

                return subscribed;

            } else {
                if(!angular.isNumber(listIds)) {
                    listIds = NewsletterList[listIds];
                }

                return ArrayService.inArray(user.subscriptions, listIds);
            }

        };

        /**
         * Check if user is not subscribed
         *
         * @param listIds
         * @param user
         * @returns {boolean}
         */
        this.isNotSubscribed = function (listIds, user) {
            if (!user) {
                user = this.getCurrent();
            }

            if (!user.subscriptions) {
                return true;
            }

            if(angular.isArray(listIds)){
                var subscribed = true;

                _.each(listIds, function(listId) {
                    listId = NewsletterList[listId];
                    if(ArrayService.inArray(user.subscriptions, listId)) {
                        subscribed = false;
                    }
                });

                return subscribed;

            } else {
                listIds = NewsletterList[listIds];
                return !ArrayService.inArray(user.subscriptions, listIds);
            }

        };

        /**
         * Check if hasRole
         * @param user
         * @param roleName
         * @returns {boolean}
         */
        this.hasRole = function (roleName, user) {
            if (!user) {
                user = this.getCurrent();
            }

            if (!_.isEmpty(user.roles)) {
                return ArrayService.inArray(user.roles, roleName);
            } else {
                return false;
            }
        };

        /**
         * Reset password
         * @param data
         * @returns {instance.$promise|*|$promise|Array.$promise|A.$promise|M.$promise}
         */
        this.resetPassword = function (data) {
            return UserApi.resetPassword(data).$promise;
        };

        /**
         * Confirm token and password
         * @param data
         * @returns {instance.$promise|*|$promise|Array.$promise|A.$promise|M.$promise}
         */
        this.confirmPassword = function (data) {
            return UserApi.confirmPassword(data).$promise;
        };


        /**
         * Activate an account
         * @param data
         * @returns {instance.$promise|*|$promise|Array.$promise|A.$promise|E.$promise}
         */
        this.activateAccount = function (data) {
            return UserApi.activateAccount(data).$promise;
        };

        /**
         * Typeahead
         * @param query
         * @returns {*|Function|promise|n|O|s}
         */
        this.getDataSuggestions = function (name, query, limit) {
            return UserApi.getDataSuggestions(
                    {
                        query: query,
                        action: name,
                        limit: limit || 4
                    }
                )
                .$promise
                .then(
                function (res) {
                    return res.data;
                }
            );
        };

    }
);
