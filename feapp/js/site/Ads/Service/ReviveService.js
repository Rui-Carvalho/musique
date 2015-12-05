angular.module('app.ads')
    .service('ReviveService',
    function ($window, $q) {
        'use strict';

        var initialised = false,
            ads = {

            };

        this.init = function () {
            if (!initialised) {
                initialised = true;
                var tag = document.createElement('script');
                tag.src = '//adserver.businessoffashion.com/delivery/asyncjs.php';
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        };

        this.observe = function (target) {
            // create an observer instance
            var deferred = $q.defer(),
                observer = new MutationObserver(
                                function(mutations) {
                                    deferred.resolve(mutations);
                                }
                            );

            // pass in the target node, as well as the observer options
            observer.observe(
                target,
                {
                    // attributes: true,
                    childList: true,
                    // characterData: true
                    subtree: true
                }
            );

            return deferred.promise;
        };
    }
);
