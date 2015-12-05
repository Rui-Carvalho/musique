angular.module('app.auth')
    .controller('LoginModalController',
    function ($scope, $q, $modalInstance, AuthService, EventManager, $log, FormServiceFactory, UserService, modalData, UrlService, ArrayService) {
        'use strict';

        $scope.form = {};
        $scope.error = {
            messageType: 'none'
        };
        $scope.feedback = null;

        // expose data
        $scope.data = modalData || {};
        $scope.status = modalData.status;

        // link form to service
        var FormService = new FormServiceFactory($scope.form);

        /**
         * Clean Feedback
         */
        $scope.cleanFeedback = function () {
            $scope.feedback = {
                error: null,
                message: null
            };
        };

        /**
         * Close modal
         */
        $scope.close = function () {
            $modalInstance.dismiss();
        };

        /**
         * Callback success
         */
        $scope.onSuccess = function (closeModal) {
            // refresh user event
            UserService.getCurrent(true);

            if (closeModal) {
                $modalInstance.close();
            } else {
                // change status
                $scope.status = 'complete';
            }
        };

        /**
         * Open specific modal
         * @param template
         */
        $scope.closeAndOpenModal = function (template) {
            $modalInstance.close(template);
        };

        /**
         * Login
         */
        $scope.login = function () {
            $scope.cleanFeedback();
            return AuthService.login($scope.data).then(
                function (res) {
                    $scope.onSuccess(true);
                    return res;
                },
                function (res) {
                    // remap errors
                    return AuthService.remapErrors(res.data.message)
                        .then(
                        function (res) {
                            $scope.status = res.status;
                            return res;
                        },
                        function (res) {
                            $scope.feedback = res;
                            return $q.reject();
                        }
                    );
                }
            );
        };

        /**
         * Registration
         */
        $scope.register = function () {
            $scope.cleanFeedback();
            return AuthService.register($scope.data).then(
                function (res) {

                    // check if data contains token and redirect
                    if (res.data.token) {
                        //save new token
                        AuthService.setToken(res.data.token);

                        //close modal and propagate user object
                        $scope.onSuccess(true);

                        // redirect to new url
                        if (res.data.redirect) {
                            UrlService.changeUrl(res.data.redirect);
                        }
                    } else {
                        $scope.onSuccess(false);
                        UrlService.setUrlToCache();
                    }

                    return res;
                },
                function (res) {
                    // remap errors
                    return AuthService.remapErrors(res.data.message)
                        .then(
                        function (res) {
                            $scope.status = res.status;
                            return res;
                        },
                        function (res) {
                            $scope.feedback = res;
                            return $q.reject();
                        }
                    );
                }
            );
        };

        /**
         * Social Login
         */
        $scope.socialLogin = function (provider) {
            $scope.cleanFeedback();
            return AuthService.authenticate(provider, $scope.data).then(
                function (res) {
                    $scope.onSuccess(true);
                    return res;
                },
                function (res) {
                    $scope.feedback = res.data.message;
                    return $q.reject();
                }
            );
        };

        /**
         * Check
         * @returns {*|boolean}
         */
        $scope.canSubmit = function () {
            return FormService.canSubmit();
        };

        /**
         * Reset password
         */
        $scope.resetPassword = function () {
            $scope.cleanFeedback();
            return UserService.resetPassword($scope.data).then(
                function (res) {
                    $scope.status = 'complete';
                    return res;
                }
            );
        };

        /**
         * Confirm password
         */
        $scope.confirmPassword = function () {
            $scope.cleanFeedback();
            return UserService.confirmPassword($scope.data).then(
                function (res) {
                    $scope.status = 'complete';
                    return res;
                }
            );
        };

        /**
         * Check if subscribed
         * @param listIds
         * @param user
         * @returns {boolean}
         */
        $scope.isSubscribed = function (listIds, user) {
            return UserService.isSubscribed(listIds, user);
        };

        /**
         * Check if user is not subscribed
         * @param listIds
         * @param user
         * @returns {boolean}
         */
        $scope.isNotSubscribed = function (listIds, user) {
            return UserService.isNotSubscribed(listIds, user);
        };

        /**
         * Activate account
         */
        $scope.activateAccount = function () {
            $scope.cleanFeedback();

            return UserService.activateAccount($scope.data).then(
                function (res) {
                    //save token
                    AuthService.setToken(res.token);

                    // reload user
                    $scope.onSuccess(true);

                    // redirect to new url
                    if ($scope.data.redirect) {
                        UrlService.changeUrl($scope.data.redirect);
                    } else {
                        // redirect to last seen page
                        UrlService.goToCachedUrl();
                    }
                    return res;
                },
                function (res) {
                    // remap errors
                    return AuthService.remapErrors(res.data.message)
                        .then(
                        function (res) {
                            $scope.status = res.status;
                            return res;
                        },
                        function (res) {
                            $scope.feedback = res;
                            return $q.reject();
                        }
                    );
                }
            );
        };

    }
);
