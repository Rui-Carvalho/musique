// https://developers.google.com/youtube/iframe_api_reference

angular.module('app.youtube')
.factory('YoutubeService',
    function ($window, $q) {
        'use strict';

        var players = [],
            initialised = false,
            ready = false;

        // youtube calback when ready
        $window.onYouTubeIframeAPIReady = function () {
            ready = true;
        };

        // player class
        function YoutubePlayer (tagId, videoId, width, height) {

            this.tagId = tagId;
            this.videoId = videoId;
            this.width = width;
            this.height = height;
            this.player = null;
            this.ready = false;

            // required from API callbacks
            var self = this;

            this.onPlayerReady = function (event) {
                //var availableQualityLevels = event.target.getAvailableQualityLevels();
                //event.target.setPlaybackQuality(
                //    self.getQuality(availableQualityLevels)
                //);
                //event.target.playVideo();
                self.ready = true;
            };

            this.onPlayerStateChange = function (event) {
                //
            };

            // refactor this one
            // https://developers.google.com/youtube/iframe_api_reference#Playback_quality
            this.getQuality = function (levels) {

                if (this.width > 1280) {
                    return 'hd720';
                } else if (this.width > 853) {
                    return 'large';
                } else if (this.width > 640) {
                    return 'medium';
                } else {
                    return 'small';
                }
            };

            this.play = function () {
                if (this.ready) {
                    this.player.playVideo();
                }
            };

            this.stop = function () {
                if (this.ready) {
                    this.player.stopVideo();
                }
            };

            this.destroy = function () {
                if (this.player) {
                    this.player.destroy();
                }
            };

            // init player
            // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            this.init = function () {
                var deferred = $q.defer();

                if ($window.YT && ready) {
                    this.player = new $window.YT.Player(
                        this.tagId,
                        {
                            height: this.height,
                            width: this.width,
                            videoId: this.videoId,
                            playerVars: {
                                autoplay: false,
                                //controls: 0,
                                //theme: 'light',
                                html5: true
                            },
                            events: {
                                onReady: function (event) {
                                    deferred.resolve(
                                        {
                                            status: true
                                        }
                                    );
                                    self.onPlayerReady(event);
                                },
                                onStateChange: function (event) {
                                    self.onPlayerStateChange(event);
                                }
                            }
                        }
                    );
                } else {
                    deferred.reject(
                        {
                            status: false
                        }
                    );
                }
                return deferred.promise;
            };
        }

        return {
            createPlayer: function (tagId, videoId, width, height) {
                var player = new YoutubePlayer(tagId, videoId, width, height);
                //save to player list
                players.push(player);

                return player;
            },
            stopAll: function () {
                angular.forEach(players, function (player) {
                    player.stop();
                });
            },
            loadApi: function () {
                if (!initialised) {
                    var tag = document.createElement('script');
                    tag.src = '//www.youtube.com/iframe_api';
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    initialised = true;
                }
            }
        };

    }
);
