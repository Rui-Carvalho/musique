/**
 * Params
 * action: '=' ->  link to function on-click without (), function must return a promise
 * disabledWhen: '=' -> prevents form to be submitted
 * cssClass: '@' -> custom classes
 * defaultLabel:'@' -> default label displayed
 */
angular.module('app.core')
    .directive('promiseButton',
    function ($log, $timeout) {
        return {
            scope: {
                id: '@',
                action: '&',
                test: '&',
                cssClass: '@class', // cssClass:'@class' // there is something wrong because is getting class and so is applied two times
                defaultLabel: '@',
                busyLabel: '@',
                successLabel: '@',
                errorLabel: '@',
                defaultMessage: '@',
                busyMessage: '@',
                successMessage: '@',
                errorMessage: '@'
            },
            template: '<div><button class="relative btn btn-default" id="{[{::id}]}" ng-class="{disabled:isWaiting,\'is-loading\':isWaiting}" ng-click="submit()"><span class="button-label">{[{label}]}</span><span class="button-label" ng-transclude>{[{label}]}</span><span class="spinner icon-spin5 animate-spin"></span></button><span class=\"text-left text-error\">{[{message}]}</span></div>',
            replace: true,
            transclude: true,
            restrict: 'E',
            link: function (scope, element, attrs) {

                /**
                 * Default status
                 * @type {string}
                 */
                scope.label = scope.defaultLabel;
                scope.message = '';
                scope.isWaiting = false;
                scope.isSuccessfullySent = false;

                var timer = null,
                    buttonElement = angular.element(element[0].childNodes[0]),
                    messageElement = angular.element(element[0].childNodes[1]),
                    buttonStatusColour = {
                        default: attrs.defaultClass ? attrs.defaultClass : 'btn-danger',
                        wait: attrs.waitClass ? attrs.defaultClass : 'btn-warning',
                        error: attrs.errorClass ? attrs.defaultClass : 'btn-danger',
                        success: attrs.successClass ? attrs.defaultClass : 'btn-success'
                    },
                    labelStatusColour = {
                        default: attrs.defaultClass ? attrs.defaultClass : 'text-danger',
                        wait: attrs.waitClass ? attrs.defaultClass : 'text-warning',
                        error: attrs.errorClass ? attrs.defaultClass : 'text-danger',
                        success: attrs.successClass ? attrs.defaultClass : 'text-success'
                    };

                // if button has to be a block
                if (scope.cssClass) {
                    buttonElement.addClass(scope.cssClass);
                }

                /**
                 * Enable boolean or function checking
                 * @returns {*}
                 */
                scope.checktest = function () {
                    if (!scope.test) {
                        return true;
                    } else {
                        return scope.test();
                    }
                };

                scope.resetCss = function () {
                    buttonElement.removeClass(buttonStatusColour.error);
                    messageElement.removeClass(labelStatusColour.error);
                    buttonElement.removeClass(buttonStatusColour.success);
                    messageElement.removeClass(labelStatusColour.success);
                    buttonElement.removeClass(buttonStatusColour.default);
                    messageElement.removeClass(labelStatusColour.default);
                    buttonElement.removeClass(buttonStatusColour.wait);
                    messageElement.removeClass(labelStatusColour.wait);
                };

                scope.defaultButton = function () {
                    scope.resetCss();
                    scope.label = scope.defaultLabel;
                    scope.message = scope.defaultMessage;
                    buttonElement.addClass(buttonStatusColour.default);
                    messageElement.addClass(labelStatusColour.default);
                };
                scope.defaultButton();

                scope.resetToDefault = function () {
                    $timeout.cancel(scope.timer);
                    scope.timer = $timeout(function () {
                        scope.defaultButton();
                    }, 3000);
                };

                scope.resetStatus = function () {
                    scope.isWaiting = false;
                    buttonElement.removeAttr("disabled");
                    scope.resetCss();
                };

                scope.busyStatus = function () {
                    scope.isWaiting = true;
                    buttonElement.attr("disabled", "disabled");
                    scope.label = scope.busyLabel;
                    scope.message = scope.busyMessage;
                    scope.resetCss();
                    buttonElement.addClass(buttonStatusColour.default);
                    messageElement.addClass(labelStatusColour.default);
                };

                scope.successStatus = function () {
                    scope.resetStatus();
                    scope.label = scope.successLabel;
                    scope.message = scope.successMessage;
                    scope.resetCss();
                    buttonElement.addClass(buttonStatusColour.success);
                    messageElement.addClass(labelStatusColour.success);

                    scope.isSuccessfullySent = true;
                    scope.resetToDefault();
                };

                scope.errorStatus = function () {
                    scope.resetStatus();
                    scope.label = scope.errorLabel;
                    scope.message = scope.errorMessage;
                    scope.resetCss();
                    buttonElement.addClass(buttonStatusColour.error);
                    messageElement.addClass(labelStatusColour.error);
                    scope.resetToDefault();
                };

                scope.submit = function () {

                    scope.defaultButton();

                    if (!scope.checktest()) {
                        buttonElement.addClass('shake');
                        $timeout(function () {
                            buttonElement.removeClass('shake');
                        }, 1000);
                    } else {
                        scope.busyStatus();
                        scope.action().then(
                            function (result) {
                                $log.debug('Button Promise Ok', result);
                                scope.successStatus();
                            },
                            function (result) {
                                $log.debug('Button Promise Ko', result);
                                scope.errorStatus();
                            }
                        );
                    }
                };
            }
        };
    }
);
