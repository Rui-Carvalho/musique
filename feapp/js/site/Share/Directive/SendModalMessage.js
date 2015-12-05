angular.module('app.share')
    .directive('sendModalMessage',
    function ($modal, EventManager, $window, AuthModalService, AuthEvents) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                sendModalMessage: '@',
                source: '@'
            },
            link: function (scope, element, attrs) {
                var openModalBox,
                    user = null,
                    source = scope.source || 'generic';

                openModalBox = function (typeId, templateUrlKey) {
                    $modal.open({
                        templateUrl: '/templates/Message/' + templateUrlKey,
                        controller: 'ShareGenericController',
                        size: 'md',
                        backdrop: false,
                        resolve: {
                            modalData: function () {
                                return {
                                    type_id: typeId,
                                    message: scope.message,
                                    source: source
                                };
                            }
                        }
                    });
                };

                // listen for user changes
                EventManager.on(AuthEvents.USER_CHANGED, function (data) {
                    user = data;
                });

                element.bind('click', function () {
                    var templateUrlKey = 'feedback_form',
                        typeId = 1;

                    // Two checks because of old type article which is used on not know places
                    if (scope.sendModalMessage == 'article' || scope.sendModalMessage == 'opinion') {
                        typeId = 2;
                        templateUrlKey = 'article_form';

                        // @TODO: pitch submission cannot modify template as is in DB!
                        if (source === 'generic') {
                            source = 'pitch';
                        }
                    }

                    if (scope.sendModalMessage == 'upsell') {
                        typeId = 3;
                        templateUrlKey = 'upsell_form';
                    }

                    if (scope.sendModalMessage == 'callin-request') {
                        typeId = 4;
                        templateUrlKey = 'callins_request_form';
                    }

                    // All modal messages other than feedback,callins_request_form form require a user to be logged in
                    // if (templateUrlKey != 'feedback_form' && templateUrlKey != 'upsell_form') {
                    if (templateUrlKey != 'feedback_form' && templateUrlKey != 'callins_request_form') {
                        if (user.id) {
                            openModalBox(typeId, templateUrlKey);
                        } else {
                            AuthModalService.setSubscribeSource(source);
                            AuthModalService.openLogin('voicesLimit', {firewall: true})
                                .then(
                                function (res) {
                                    openModalBox(typeId, templateUrlKey);
                                }
                            );
                        }
                    } else {
                        openModalBox(typeId, templateUrlKey);
                    }
                });
            }
        };
    }
);