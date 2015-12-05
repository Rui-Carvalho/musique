angular.module('app.youtube')
    .directive('youtubePlayer',
    function (DomService, YoutubeService, AgentService, EventManager, AuthModalService, $q, $timeout, AuthEvents, YoutubeEvents, DataService, MixpanelService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                id: '@',
                width: '@',
                height: '@',
                firewall: '@',
                animation: '@'
            },
            template: '<div class="container-fill video-player {[{isPlaying ? \'active\' : \'inactive\'}]}">' +
            '<div ng-show="ready" ng-style="containerStyle">' +
            '<div></div>' +
            '<div class="player-header" ng-show="!isMobile">' +
            '<div class="pull-right" ng-click="removeVideo($event)"><i class="icon icon-close"></i></div>' +
            '</div>' +
            '</div>' +
            '<div ng-show="!ready" class="relative container-fill">' +
            '<div ng-transclude class="transcluded {[{isPlaying ? \'active\' : \'inactive\'}]}"></div>' +
            '<div ng-show="!disabled" class="player-controls"><i ng-click="playVideo($event)" class="icon icon-play"></i></div>' +
            '<div>' +
            '</div>',

            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

                var player = null,
                    videoId = scope.id || null,
                    containerElement = element[0],
                    videoElementContainer = element.children()[0],
                    videoElement = element.children().children()[0],
                    imgElement = element.children().children()[1],
                    user = null,
                    firewall = scope.firewall === 'true',
                    animation = scope.animation === 'true'
                    ;

                // listen for user changes
                EventManager.on(AuthEvents.USER_CHANGED, function (data) {
                    user = data;

                    // stop video when logged-out
                    if (!user.id && firewall) {
                        scope.removeVideo();
                    }
                });

                scope.ready = false;
                scope.isPlaying = false;
                scope.init = false;
                scope.disabled = false;
                scope.containerStyle = {};
                scope.isMobile = AgentService.isMobile();

                // init script if not loaded already
                if (!videoId) {
                    scope.disabled = true;
                } else {
                    YoutubeService.loadApi();
                }

                /**
                 * Play video and check user
                 * @param event
                 */
                scope.playVideo = function (event) {

                    event.stopPropagation();
                    event.preventDefault();

                    YoutubeService.stopAll();

                    // check grants
                    if (!user.id && firewall) {
                        AuthModalService.setSubscribeSource('RestrictedContent');
                        AuthModalService.openLogin('restrictedContent', {firewall: true})
                            .then(
                            function () {
                                scope.playVideo(event);
                            }
                        );
                        return;
                    }

                    // set status
                    scope.setStatus(true)
                    .then(
                        function (){
                            scope.initPlayer();
                        }
                    );

                };

                /**
                 * Create player and play video
                 */
                scope.initPlayer = function () {
                    if (!player) {
                        // create a new player instance
                        var height = DomService.getHeight(containerElement),
                            width = DomService.getWidth(containerElement)
                            ;
                        // leave it here as it has to detect container size after repaint
                        player = YoutubeService.createPlayer(
                            videoElement,
                            videoId,
                            width,
                            height
                        );

                        scope.containerStyle = {
                            height: height + 'px',
                            width: width + 'px'
                        };
                    }
                    scope.trackEvent();

                    if (!scope.init) {
                        // bootstrap player
                        player.init().then(
                            function (res) {
                                scope.init = true;
                                scope.ready = true;
                            },
                            function (res) {
                                // player's API not ready
                                scope.ready = false;
                            }
                        );
                    } else {
                        scope.ready = true;
                        player.play();
                    }
                };

                /**
                 * Track event
                 */
                scope.trackEvent = function () {
                    var data = DataService.buildDataFromAttributes(attrs, 'mixpanel');
                    MixpanelService.addEvent(data);
                };

                /**
                 * Remove video
                 * @param event
                 */
                scope.removeVideo = function (event) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    scope.setStatus(false);

                    player.stop();
                    scope.ready = false;
                };

                /**
                 * Set player status and emit event
                 * @param status
                 */
                scope.setStatus = function (status) {
                    var promise = null,
                        deferred = $q.defer();

                    scope.isPlaying = status;
                    EventManager.emit(
                        YoutubeEvents.PLAYER_STATUS_CHANGED,
                        {
                            status: status,
                            id: scope.id
                        }
                    );

                    // return a promise here
                    if (animation && status) {
                        promise = $timeout(
                            function(){
                                return true;
                            }, 1000);
                    } else {
                        deferred.resolve(true);
                        promise = deferred.promise;
                    }

                    return promise;
                };
            }
        };
    }
)
;
