angular.module('app.core')
.factory('FormServiceFactory',
    function () {
        'use strict';

        /**
         * Create your own template and use an object as model
         * Register in your controller as new Factory($scope.form)
         * @param <form name="form.ref">
         */
        function Factory(formObj) {

            this.formObj = formObj;

            /**
             * Check if all form is valid
             * @returns boolean
             */
            this.canSubmit = function () {
                var valid = this.formObj.ref.$valid;

                if (!valid) {
                    this.showErrors(this.formObj);
                }

                return valid;
            };

            /**
             * Set form fields dirty
             * @param forms
             */
            this.showErrors = function () {
                angular.forEach(this.formObj.ref, function (field, name) {
                        if (typeof(name) === 'string' && !name.match('^[\\$]') && !field.$valid) {
                            field.$setViewValue(field.$value);
                            field.$dirty = true;
                            field.$timedout = true;
                        }
                    }
                );
            };

            /**
             * Clean validators
             */
            this.cleanAll = function () {
                angular.forEach(this.formObj.ref, function (field, name) {
                        if (typeof(name) === 'string' && !name.match('^[\\$]')) {
                            field.$timedout = false;
                        }
                    }
                );
            };
        }

        return Factory;

    }
)
;
