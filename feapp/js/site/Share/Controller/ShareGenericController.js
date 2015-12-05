angular.module('app.share')
    .controller('ShareGenericController',
    function ($scope, $modalInstance, $q, $window, FormServiceFactory, ShareService, UserService, modalData) {
        'use strict';

        $scope.form = {};
        $scope.data = modalData || {};
        $scope.user = UserService.getCurrent();
        $scope.done = false;

        var FormService = new FormServiceFactory($scope.form);

        $scope.canSubmit = function () {
            return FormService.canSubmit();
        };

        $scope.submit = function () {
            //  adding url to message
            var data = angular.copy($scope.data),
                promise = null;

            // if anon
            if ($scope.user.id) {
                angular.extend(data, {
                    email: $scope.user.email,
                    firstname: $scope.user.firstname,
                    lastname: $scope.user.lastname
                });
            }

            if (data.article_id) {
                promise = ShareService.shareArticle(data);
            } else if (data.type_id) {
                promise = ShareService.submitMessage(data);
            }

            promise.then(
                function (res) {
                    // success!
                    // $scope.close();
                    $scope.done = true;
                    return res;
                },
                function (res) {
                    return $q.reject(res);
                }
            );

            return promise;
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }
)
;
