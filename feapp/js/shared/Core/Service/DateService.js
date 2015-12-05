angular.module('app.core')
    .service('DateService',
    function ($log) {
        var scope = this;

        scope.fromString = function (date) {
            return new Date(date.replace(/-/g, '/').split('.')[0]);
        };

        scope.toString = function (date) {
            return date.getFullYear() + '-' + scope.formatDate(date.getMonth() + 1, 2) + '-' + scope.formatDate(date.getDate(), 2);
        };

        scope.toTimeString = function (date) {
            return scope.formatDate(date.getHours(), 2) + ':' + scope.formatDate(date.getMinutes(), 2);
        };

        scope.toNormalisedString = function (date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        };

        //@TODO remove when moment will be fixed!
        scope.toWeekOfYear = function(date) {
        	var currentDate = moment(date),
                week = currentDate.week(),
                year = currentDate.year(),
                month = currentDate.month()
                ;

            if (month === 11 && week === 1) {
                year += 1;
            }

            return week + '-' + year;
        };

        /**
         * Pad the day with zeros (ECMA 6)
         * @param number
         * @param zeroPadding
         * @returns {*|string}
         */
        scope.formatDate = function (number, zeroPadding) {
            return (1e15 + number + "" ).slice(-zeroPadding);
        };

        scope.isWeekend = function (date) {
            return date.getDay() === 0 || date.getDay() === 6;
        };

        scope.fromTimeString = function (time) {
            var response = time.split(':'),
                date = new Date();

            date.setHours(parseInt(response[0]));
            date.setMinutes(parseInt(response[1]));

            return date;
        };

        /**
         * Add days to a string time
         * @param date
         * @param days
         * @returns {Date}
         */
        scope.addDays = function (date, days) {
            return new Date(+Date.parse(date) + (864e5 * days));
        };

        scope.removeDays = function (date, days) {
            return new Date(+Date.parse(date) - (864e5 * days));
        };

        scope.addHours = function (date, hours) {
            return new Date(+Date.parse(date) + (36e5 * hours));
        };
    }
);
