angular.module('app.core')
    .service('HistoryService',
    function ($location, $window) {
        'use strict';

       this.goBack = function () {
           if ($window.history.length > 1) {
               $window.history.back();
           } else {
               $window.location.href = '/';
           }
       };
    }
)
;
