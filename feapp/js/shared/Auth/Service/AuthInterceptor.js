angular.module('app.auth')
	.service('AuthSignatureInterceptor',
		function(CryptFactory, Crc32) {
			'use strict';

            // Refactor signature here
            function createSignature (data, jwt) {
				return new CryptFactory(jwt)
					.encrypt(
						Crc32(angular.toJson(data))
					);
            }

			return {
				// optional method
				'request': function(config) {
                    if (config.data && typeof config.data === 'object' && config.headers['X-Auth-Token']) {
                        config.headers = config.headers || {};
                        config.headers.Signature = createSignature(config.data, config.headers['X-Auth-Token']);
                    }
					return config;
				}
			};

		}
	);
