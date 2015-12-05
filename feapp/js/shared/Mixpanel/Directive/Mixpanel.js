/**
* track page view on google GTM to mixpanel
*/

angular.module('app.mixpanel')
.directive('mixpanel',
    function (MixpanelService, DataService, $timeout, $window) {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // building object
                var data = DataService.buildDataFromAttributes(attrs, 'mixpanel');

                //inject event for GTM
                if (data.Trigger.toLowerCase() === 'load') {
                    MixpanelService.addEvent(data);
                } else {
                    element.on('click',
                        function (e) {
                            MixpanelService.addEvent(data, true);
                        }
                    );
                }


            }
        };
    }
)
;
