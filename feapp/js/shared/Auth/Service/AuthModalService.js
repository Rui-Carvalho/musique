angular.module('app.auth')
    .service('AuthModalService',
    function (AuthService, UserService, $modal, EventManager, MixpanelService, $q, $window, PageCountService, UrlService, $timeout, AgentService, AuthEvents) {
        'use strict';

        var self = this,
            popupOpen = false,
            modalInstance = null,
            subscriberSource = '',
            legacy = false,
            generator = null,
            templateEvent = {
                login: 'ModalLogin',
                register: 'ModalRegister',
                reset_password: 'ModalResetPassword',
                confirm_password: 'ModalChangePassword',
                activate_account: 'ModalActivateAccount',
                register_call_ins: 'ModalSignupCallins'
            }
            ;

        /**
         * Set subscriber source
         */
        this.setSubscribeSource = function (source) {
            subscriberSource = source;
        };

        /**
         * Legacy login will reload content
         */
        this.setLegacyMode = function (status) {
            legacy = status;
        };

        /**
         * Open modals
         * @param template
         * @param data
         */
        this.openAuthModal = function (template, data, injectUser) {
            var deferred = $q.defer();

            // Prevent modal clash resetting page counter
            PageCountService.reset();

            // adding source and fix data
            data = data ? angular.extend({source: subscriberSource}, data) : {};

            // inject user payload
            if (injectUser) {
                data = angular.extend(UserService.getCurrent(), data);
            }

            if (!popupOpen) {
                popupOpen = true;

                EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: true});

                // track event
                MixpanelService.addEvent({
                    Event: templateEvent[template],
                    firewall: data.firewall === true
                });

                modalInstance = $modal.open({
                    templateUrl: '/templates/Auth/' + template,
                    controller: 'LoginModalController',
                    size: 'md',
                    backdrop: true,
                    animation: !AgentService.isIE(),
                    //windowClass: 'modal-fixed-bottom',
                    resolve: {
                        modalData: function () {
                            return data;
                        }
                    }
                });

                // return promise
                return modalInstance.result
                    .then(
                    function (res) {
                        // res is the modal template
                        if (res) {
                            self.closeModal(true);

                            /**
                             * Open another modal passing parent's params
                             */
                            return self.openAuthModal(res,
                                {
                                    status: data.status,
                                    email: data.email,
                                    password: data.password,
                                    source: data.source
                                }
                            );
                        } else {
                            // if generator defined call it
                            if (generator) {
                                self.closeModal(true);
                                return generator();
                            } else {
                                self.closeModal();
                                return res;
                            }

                        }


                    },
                    function (res) {
                        self.closeModal();
                        return $q.reject();
                    }
                );

            } else {
                deferred.reject();
                return deferred.promise;
            }
        };

        /**
         * Extends data with status
         * @param messageType
         * @param data
         * @returns {*}
         */
        this.extendData = function (messageType, data) {
            data = data || {};
            return angular.extend(data,
                {
                    status: messageType,
                    signup_referer_url: $window.location.href
                }
            );
        };

        /**
         * Initialise EventManager for login event
         * src/BOF/BOFFrameworkBundle/Resources/views/Angular/login.html.twig
         * @param  {string} messageType    custom message used in ng-switch
         * @param  {object} data           payload
         * @param  {boolean} force          do not detect just open login modal
         * @param  {boolean} customTemplate use a custom template based on messageType label
         * @param  {boolean} injectUser     auto-inject user data in to forms
         */
        this.openLogin = function (messageType, data, force, customTemplate, injectUser) {
            var extendedData = this.extendData(messageType, data),
                template = null,
                promise = null;

            if (AuthService.alreadyLoggedIn() || force) {
                template = customTemplate ? 'login_' + messageType : 'login';
                promise = self.openAuthModal(template, extendedData, injectUser);
            } else {
                template = customTemplate ? 'register_' + messageType : 'register';
                promise = self.openAuthModal(template, extendedData, injectUser);
            }

            // @TODO: please remove this stuff when legacy is gone!!!
            promise.then(
                function (res) {
                    //legacy
                    if (legacy) {
                        $timeout(
                            function () {
                                UrlService.reloadCurrentPage();
                            },
                            1000);
                    }

                    return res;
                }
            );

            return promise;
        };

        /**
         * Initialise EventManager for register event
         * src/BOF/BOFFrameworkBundle/Resources/views/Angular/register.html.twig
         * @param  {string} messageType    custom message used in ng-switch
         * @param  {object} data           payload
         * @param  {boolean} customTemplate use a custom template based on messageType label
         * @param  {boolean} injectUser     auto-inject user data in to forms
         * @param injectGenerator
         * @param {boolean} stayLogin User wont be logout
         */
        this.openSignup = function (messageType, data, customTemplate, injectUser, injectGenerator, stayLogin) {
            var template = customTemplate ? 'register_' + messageType : 'register',
                extendedData = this.extendData(messageType, data)
                ;

            if(!stayLogin) {
                this.openLogout(false, true);
            }

            // redirect to generator if another modal is required
            if (injectGenerator) {
                generator = function () {
                    generator = null;
                    return self.openAuthModal(template, extendedData, injectUser);
                };
            } else {
                generator = null;
            }

            return self.openAuthModal(template, extendedData, injectUser);
        };

        /**
         * Initialise EventManager for reset password
         */
        this.openResetPassword = function () {
            return self.openAuthModal('reset_password');
        };

        this.openConfirmPassword = function (data) {
            return self.openAuthModal('confirm_password', data);
        };

        /**
         * Initialise EventManager for reset password
         */
        this.openActivateAccount = function (data) {

            // logout previous user
            this.openLogout(false, true);

            return self.openAuthModal('activate_account', data);
        };

        /**
         * Initialise EventManager for login event
         */
        this.openLogout = function (track, ignoreLegacy) {
            return AuthService.logout(track).then(
                function (res) {
                    UserService.getCurrent(true);

                    // go to home page if legacy mode
                    if (legacy && !ignoreLegacy) {
                        $timeout(
                            function () {
                                UrlService.gotoHomepage();
                            },
                            1000);
                    }

                    return res;
                }
            );
        };

        /**
         * @param preventEmit
         */
        this.closeModal = function (preventEmit) {
            if (!preventEmit) {
                EventManager.emit(AuthEvents.PROTECT_CONTENT, {status: false});
            }
            popupOpen = false;
        };


    }
);
