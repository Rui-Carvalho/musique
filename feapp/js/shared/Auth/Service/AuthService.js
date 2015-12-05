angular.module('app.auth')
    .service('AuthService',
    function ($auth, AuthApi, $localStorage, moment, CryptService, $q, MixpanelService) {
        'use strict';

        var self = this,
            errorMap = {
                'CONFIRM_USER_EMAIL_SENT': {
                    status: 'confirmation_sent'
                },
                'ACTIVATION_LINK_EXPIRED': {
                    status: 'link_expired'
                },
                'USER_CALLINS_DENIED_SHOW_REQUEST': {
                    status: 'confirmation_sent_callins_request'
                }
            };


        /**
         * Get current user
         * @returns {*}
         */
        this.getPayload = function () {
            var payload = $auth.getPayload();

            // if expired delete token
            if (this.isExpired(payload)) {
                $auth.removeToken();
                payload = {};
            } else {
                payload.id = payload.user_id;
            }

            return payload;
        };

        /**
         * Social login
         * @param payload
         * @returns {boolean}
         */
        this.isExpired = function (payload) {
            var expDate = new Date(0);

            if (payload) {
                expDate.setUTCSeconds(payload.exp);
                return expDate < new Date();
            } else {
                return true;
            }
        };

        /**
         * Logout calling API, needed for legacy code
         * @returns {*}
         */
        this.logout = function (track) {
            track = track ? track : true;

            // track event
            if (track) {
                MixpanelService.addEvent({
                    Event: 'Logout'
                }, true);
            }

            // call backend and destroy session
            return AuthApi.logout().$promise
            .then(
                function () {
                    // delete token
                    return $auth.logout({});
                }
            );
        };

        /**
         * Login
         * @param data
         * @returns {*}
         */
        this.login = function (data) {
            data = data || {};

            return $auth.login(data)
                .then(
                function (res) {
                    self.hasLoggedIn();

                    MixpanelService.addEvent({
                        Event: 'Login',
                        firewall: data.firewall
                    });

                    return res;
                }
            );
        };

        /**
         * Registration
         * @param data
         * @returns {*}
         */
        this.register = function (data) {
            data = data || {};

            // activation required
            return AuthApi.signup(data).$promise
                .then(
                function (res) {
                    MixpanelService.addEvent({
                        Event: 'Register',
                        firewall: data.firewall
                    });

                    return res;
                }
            );
        };

        /**
         * Required when activating a user
         * @param token
         */
        this.setToken = function (token) {
            $auth.setToken(token);
        };

        /**
         * Authenticate social provider
         * @param provider
         * @returns {*}
         */
        this.authenticate = function (provider, data) {
            data = data || {};

            // TODO: not good to pass additional data hardcoded
            return $auth.authenticate(provider,
                    {
                        source: data.source,
                        signup_referer_campaign_id: data.signup_referer_campaign_id
                    }
                )
                .then(
                function (res) {
                    self.hasLoggedIn();

                    MixpanelService.addEvent({
                        Event: 'SocialLogin',
                        firewall: data.firewall
                    });

                    return res;
                }
            );
        };

        /**
         *  Check if display signup form when login requested
         * @returns {boolean|*}
         */
        this.alreadyLoggedIn = function () {
            return $localStorage.alreadyLoggedIn;
        };
        this.hasLoggedIn = function () {
            $localStorage.alreadyLoggedIn = true;
        };


        /**
         * Will get the content views from local storage,
         * increment the views of the current day and save it back to local storage
         */
        this.getMonthlyViews = function (store) {
            var
                perDayReadContent = CryptService.decryptJson($localStorage[store]),
                rollingDateLimit = moment().subtract(30, 'days'),
                currentDate = moment().format('YYYY-MM-DD'),
                counter = 0,
                currentIndex = null
                ;

            // increment counter
            if (Object.keys(perDayReadContent).length === 0) {
                perDayReadContent[currentDate] = 0;
            }
            currentIndex = Object.keys(perDayReadContent).sort().pop();
            perDayReadContent[currentIndex] += 1;

            // check if current is still valid
            if (moment(currentIndex).isAfter(rollingDateLimit)) {
                counter = perDayReadContent[currentIndex];
            } else {
                perDayReadContent[currentDate] = 1;
            }

            $localStorage[store] = CryptService.encryptJson(perDayReadContent);

            return counter;
        };

        /**
         * Will get the content views from local storage,
         * increment the views of the current day and save it back to local storage
         */
        this.getUniqueMonthlyViews = function (store, uniqueId) {
            var
                perDayReadContent = CryptService.decryptJson($localStorage[store]),
                rollingDateLimit = moment().subtract(30, 'days'),
                currentDate = moment().format('YYYY-MM-DD'),
                counter = 0,
                currentIndex = null
                ;

            // Get object keys (date) ['2015-01-01', ...]
            if (Object.keys(perDayReadContent).length === 0) {
                perDayReadContent[currentDate] = [];
            }
            currentIndex = Object.keys(perDayReadContent).sort().pop();

            // push to array of unique ids {'2015-01-01': [123], ...} if not found
            if (_.indexOf(perDayReadContent[currentIndex], uniqueId) < 0) {
                perDayReadContent[currentIndex].push(uniqueId);
            }

            // check if current is still valid
            if (moment(currentIndex).isAfter(rollingDateLimit)) {
                // return counter
                counter = perDayReadContent[currentIndex].length;
            } else {
                // create a new key because is a new month
                perDayReadContent[currentDate] = [];
            }

            $localStorage[store] = CryptService.encryptJson(perDayReadContent);

            return counter;
        };

        /**
         * Refresh Token
         */
        this.refresh = function (force) {
            var deferred = $q.defer(),
                token = $auth.getToken()
                ;

            if (token || force) {
                return AuthApi.refresh(
                    {
                        // 'bof2': force, //@TODO should be removed
                        'refresh': true
                    }
                ).$promise
                    .then(
                    function (res) {
                        self.setToken(res.token);
                        return self.getPayload();
                    },
                    function (res) {
                        return {};
                    }
                );
            } else {
                deferred.reject({});
                return deferred.promise;
            }
        };

        /**
         * Auto-login using sessions
         */
        this.tokenFromSession = function () {
            var deferred = $q.defer();

            if (!$localStorage.hasLoggeIn) {
                // do only once
                $localStorage.hasLoggeIn = true;

                return this.refresh(true);
            } else {
                deferred.reject();
                return deferred.promise;
            }
        };


        /**
         * Manipulate promise
         * @param error
         */
        this.remapErrors = function (message) {
            var deferred = $q.defer(),
                mapped = errorMap[message];

            if (mapped) {
                deferred.resolve(mapped);
            } else {
                deferred.reject(message);
            }

            return deferred.promise;
        };

    }
)
;
