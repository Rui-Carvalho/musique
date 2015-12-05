angular.module('app.disqus')
.directive('disqusLoader',
    function ($log, $timeout, $disqus, EventManager, AuthEvents) {
        'use strict';

        return {
            restrict: 'AC',
            replace: true,
            scope: {
                url: '@',
                title: '@'
            },
            template: '<div id="disqus_thread"></div>',
            link: function link(scope) {

                var payload = null,
                    url = scope.url,
                    title = scope.title;

                scope.reloadDisqus = function () {
                    $log.debug('Disqus reload', url);
                    $disqus.commit(url, title, payload);
                };

                // user event re-commit
                EventManager.on(AuthEvents.USER_CHANGED, function(user){
                    if (user.payload) {
                        payload = user.payload;
                        $log.debug('Disqus set payload', payload);
                    } else {
                        payload = '';
                        $log.debug('Disqus no payload');
                    }
                    scope.reloadDisqus();
                });

                // apply when tab clicked
                EventManager.on('disqusThreadSwitch', function(data){
                    url = data.url;
                    title = data.title;
                    scope.reloadDisqus();
                });
            }
        };
    }

)

// Used by ArticleInjectorTabs, can be used with buttons
.directive('disqusThreadSwitcher',
    function (EventManager) {
        'use strict';

        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                var data = attrs.disqusThreadSwitcher;
                element.on('click', function() {
                    EventManager.emit('disqusThreadSwitch', {tab: data});
                });
            }
        };
    }
)
;
