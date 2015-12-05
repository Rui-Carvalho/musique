angular.module('app.share')
    .directive('linkShare',
    function ($modal, MixpanelService, DataService) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                sharedId: '@',
                message: '@',
                title: '@',
                titleSubmitted: '@',
                source: '@'
            },
            link: function (scope, element, attrs) {

                element.bind('click', function (event) {
                    scope.openModal();
                });

                scope.trackEvent = function () {
                    var data = DataService.buildDataFromAttributes(attrs, 'mixpanel');
                    MixpanelService.addEvent(data);
                };

                scope.openModal = function () {
                    var modal = $modal.open({
                        templateUrl: '/templates/Message/share_form',
                        controller: 'ShareGenericController',
                        size: 'md',
                        resolve: {
                            modalData: function () {
                                return {
                                    article_id: scope.sharedId,
                                    message: scope.message,
                                    title: scope.title,
                                    titleSubmitted: scope.titleSubmitted,
                                    source: scope.source || 'article'
                                };
                            }
                        }
                    });

                    // tracking share
                    modal.result.then(
                        function (res) {
                            scope.trackEvent();
                        },
                        function (res) {
                            scope.trackEvent();
                        }
                    );
                };
            }
        };
    }
)
;
