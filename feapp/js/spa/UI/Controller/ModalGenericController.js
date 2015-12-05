angular.module('app.ui')
.controller('ModalGenericController', function($scope, $modalInstance, modalParams){

    $scope.params = modalParams;

    $scope.close = function () {
        $modalInstance.dismiss();
    };
});
