angular.module('app.ui')
.service('UiModalService',
function ($modal, EventManager, MixpanelService, $q, $window, UrlService, $timeout, AgentService, AuthEvents) {
    'use strict';

    var self = this,
        modalInstance = null;

    this.openModal = function (config, resolve) {
        EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: false});

        modalInstance = $modal.open({
            templateUrl: config.template,
            controller: config.controller,
            size: 'md',
            backdrop: true,
            backdropClass: 'modal-backdrop--opaque',
            animation: !AgentService.isIE(),
            //windowClass: 'modal-fixed-bottom',
            resolve: {
                modalParams: resolve
            }

        });

        return modalInstance;
    };

});
