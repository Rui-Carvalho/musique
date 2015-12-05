angular.module('app.core')
.directive('formatDate',

    function ($log, moment, DateService) {
        'use strict';

        return {
            scope: {
                maxHours: '@',
                date: '@',
                formatFallback: '@'
            },
            template: '<span>{[{formattedDate}]}</span>',
            replace: true,
            restrict: 'E',
            transclude: false,
            link: function postLink(scope, element, attrs) {
                scope.formattedDate = '';

                var maxHours = parseInt(scope.maxHours, 10),
                    test = moment().subtract(maxHours, 'hours'),
                    original = moment(DateService.fromString(scope.date)),
                    currentDate = new Date(),
                    yesterday = original.isSame(currentDate.setDate(currentDate.getDate() -1), 'day' );

                if (maxHours > 0) {
                    if (original > test) {
                        scope.formattedDate =  original.fromNow();
                    } else if (yesterday) {
                        scope.formattedDate = 'yesterday';
                    } else {

                        // Optional format for when it's not in 
                        var format = scope.formatFallback || 'DD/MM/YYYY';
                        scope.formattedDate =  original.format(format);
                    }
                } else {
                    scope.formattedDate =  original.fromNow();
                }
            }
        };
    }
);
