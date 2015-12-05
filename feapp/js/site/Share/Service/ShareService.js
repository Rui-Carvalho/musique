angular.module('app.share')
    .service('ShareService',
    function (DataService, ShareApi) {
        'use strict';

        // extend class
        var self = this;

        self.shareArticle = function (data) {
            return ShareApi.share(data).$promise;
        };

        self.submitMessage = function (data) {
            return ShareApi.generic(data).$promise;
        };
    }
);
