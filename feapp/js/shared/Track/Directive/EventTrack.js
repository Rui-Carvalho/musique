/**
* AJAX
* bof-track imp clk

* /track-events

* platform
* event_name
* object_id
* context ?
* language ?
*
* <a href="/american-apparel"  class="kws_link bof-track imp clk profile_id_1189" data-e="profile.link" data-id="1189" ...>
*/


angular.module('app.track')
.directive('bofTrack',
    function ($window, TrackService, ArrayService, $timeout) {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var data = {
                    event: attrs.e,
                    action: '',
                    label: '',
                    value: attrs.id
                },
                classes = attrs.class.split(/\s+/),
                trackImpressions = ArrayService.inArray(classes, 'imp'),
                trackClick = ArrayService.inArray(classes, 'clk')
                ;


                // track impressions
                if (trackImpressions) {
                    data.action = 'impression';
                    TrackService.addEvent(data);
                }

                /**
                 * Track an event
                 * @TODO: preventDefault and wait 150ms to track event
                 */
                if (trackClick) {
                    element.bind('click', function(event){
                       event.preventDefault();

                        data.action = 'click';
                        TrackService.emitEvent(data).then(function(res) {
                            // GA takes time!!!!!
                            $timeout(function(){
                               $window.location.href = attrs.href;
                           },500); // modify this value!!!!!
                        });
                    });
                }
            }
        };
    }
)
;
