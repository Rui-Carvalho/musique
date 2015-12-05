angular.module('app.crypt')
.factory('CryptFactory',
    function (CryptoJS) {
        function CryptFactory (secret) {

            this.setSecret = function (newSecret) {
                secret = newSecret;
            };

            this.encrypt = function (message) {
                if (message) {
                    return CryptoJS.AES.encrypt(message, secret).toString();
                }
                return null;
            };

            this.decrypt = function (message) {
                if (message) {
                    return CryptoJS.AES.decrypt(message, secret)
                        .toString(CryptoJS.enc.Utf8);
                }
                return null;
            };

            this.encryptJson = function (message) {
                return this.encrypt(angular.toJson(message));
            };

            this.decryptJson = function (message) {
                var res = this.decrypt(message);
                if (res) {
                    return angular.fromJson(res);
                } else {
                    return {};
                }
            };
        }
        return CryptFactory;
    }
)
.provider('CryptService',
    function () {
        'use strict';

        var SECRET = '';

        /**
         * Provider method to set secret
         * @param secret
         */
        this.setSecret = function (secret) {
            SECRET = secret;
        };

        /**
         *
         * @param EventManager
         * @param UrlService
         * @returns {CryptService}
         */
        this.$get = function (CryptFactory, CryptoJS) {
            return new CryptFactory(SECRET);
        };

    }
);
