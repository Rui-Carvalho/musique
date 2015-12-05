angular.module('app.ui')
    .directive('uiPaginationComponent',
    function (ChannelManager, UiEvents) {
        'use strict';

        return {
            template: '<div>'+
                '<div class="margin-bottom-xs-3"><span class="text-label--set-1">{[{currentPage}]}/{[{numPages}]}</span></div><pagination class="inline-block  pagination-md  no-margin" max-size="maxSize" total-items="totalItems" items-per-page="itemsPerPage" ng-model="currentPage" boundary-links="true" rotate="false" ng-change="handleChange()" num-pages="numPages"></pagination>'+
            '</div>',
            restrict: 'E',
            replace: true,
            scope: {
                channel: '@',
                max:  '@'
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var ChannelEventManager = ChannelManager.subscribe(scope.channel);

                scope.itemsPerPage = 0;
                scope.totalItems = 0;
                scope.maxSize = parseInt(scope.max) || 10;

                scope.handleChange = function () {
                    ChannelEventManager.emit(
                        UiEvents.CHANGE_PAGINATION,
                        {
                            page: scope.currentPage
                        }
                    );
                };

                ChannelEventManager.on(
                    UiEvents.UPDATE_PAGINATION,
                    function (res) {
                        scope.currentPage = res.page;
                        scope.totalItems = res.total;
                        scope.itemsPerPage = res.limit;
                    }
                );

            }
        };
    }
);
