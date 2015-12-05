angular.module('app.core')
    .service('QuerystringRouter',
    function (UrlService) {
        'use strict';

        this.routingTable = {};

        /**
         * Private function
         * @param action
         * @param params
         */
        this.init = function () {
            var params = UrlService.parseQuery(),
                action = params.action;

            // check routing table and dispatch
            if (this.routingTable.hasOwnProperty(action)) {
                // callback action
                var callback = this.routingTable[action];

                // emit event
                if (callback) {
                    callback(params);
                }

                //cleanup querystring and save into history
                UrlService.clearQuery();
            }
        };

        /**
         * Appending routes
         * @param action
         * @param callback
         * @returns {*}
         */
        this.when = function (action, params) {
            this.routingTable[action] = params;
            // chain
            return this;
        };

    }
)
;
