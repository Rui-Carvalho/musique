angular.module('app.search')
.directive('searchTypeAhead',
    function ($modal, EventManager, AuthEvents) {
        'use strict';

        return {
            template: '<a fast-click href="javascript:void(0)" title="Search" class="nav-icon-link" ng-click="openModal()"><span ng-transclude></span><i class="icon-search"></i></a>',
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
            },
            link: function (scope, element, attrs) {

                scope.openModal = function () {
                    EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: true});

                    var modalInstance = $modal.open({
                            templateUrl: '/templates/Framework/search_type_ahead',
                            controller: 'SearchTypeAheadController',
                            size: 'lg',
                            backdrop: false,
                            windowClass: 'modal-search',
                            resolve: {
                                modalData: function(){
                                    return {
                                        query: ''
                                    };
                                }
                            }
                        });

                    modalInstance.result.finally(
                         function (res) {
                             EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: false});
                        }
                    );
                };

            }
        };
    }
)
;
