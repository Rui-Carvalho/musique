angular.module('app.menu')
/**
 * thumbnail
 *
 */
    .directive('menuInjector',
    function ($log, $window, $timeout, EventManager, ArrayService, PaginationService, ArticleService, DiscussionService, CareerService, ProfileService, SchoolsService, CoursesService, TermsService, AgentService, DailyDigestService, RankingService, ShowService) {
        'use strict';

        return {
            template: '<a ng-class="{active: active}" ng-lazy-mouseover="inject($event)" ng-click="link($event)" ng-transclude></a>',
            replace: true,
            restrict: 'A',
            transclude: true,
            scope: {
                container: '@',
                view: '@',
                categories: '@',
                href: '@',
                active: '@',
                external: '@',
                types: '@',
                filters: '@',
                hasCompositeParents: '@',
                // bof500 only
                collectionId: '@',
                // Used by shows only
                season: '@',
                week: '@'
            },
            link: function (scope, element, attrs) {

                var items = [],
                    href = scope.href,
                    filters = {
                        offset: 0,
                        limit: 5,
                        attributes: 'short',
                        categories: scope.categories,
                        types: scope.types || 'post',
                        sort: 'DESC',
                        has_composite_parents: scope.hasCompositeParents
                    }
                    ;

                // simulate link on dbclick
                scope.link = function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    $window.location.href = href;
                };

                // preload data
                scope.preload = function () {
                    var promise = null;

                    // skip if display is small
                    if (AgentService.isMobile() || scope.external) {
                        return false;
                    }

                    // check categories and get data
                    if (ArrayService.inArray(['intelligence', 'global-currents', 'fashion-tech', 'people', 'education', 'opinion', 'education-report-2015', 'video'], scope.categories)) {
                        promise = ArticleService.getAll(filters, true);
                    } else if (ArrayService.inArray(['digest'], scope.categories)) {
                        promise = DailyDigestService.getArticles({}, true);
                    } else if (ArrayService.inArray(['syndicated'], scope.categories)) {
                        promise = ArticleService.getAllSyndicatedTopStory(filters, true);
                    } else if (ArrayService.inArray(['discussion'], scope.categories)) {
                        promise = DiscussionService.getAll(filters, true);
                    } else if (ArrayService.inArray(['functions', 'companies', 'content'], scope.categories)) {
                        promise = CareerService.getAll(filters, true);
                    } else if (ArrayService.inArray(['bof500'], scope.categories)) {
                        promise = ProfileService.getSearchAll(scope.collectionId, filters.limit);
                    } else if (ArrayService.inArray(['functions', 'courses', 'content'], scope.categories)) {
                        promise = CoursesService.getAll(filters, true);
                    } else if (ArrayService.inArray(['school'], scope.categories)) {
                        promise = SchoolsService.getAll(filters, true);
                    } else if (ArrayService.inArray(['term'], scope.categories)) {
                        promise = TermsService.fetch();
                    } else if (ArrayService.inArray(['rankings'], scope.categories)) {
                        promise = RankingService.fetch();
                    } else if (ArrayService.inArray(['shows'], scope.categories)) {
                        promise = ShowService.getFeaturedShows(scope.season, scope.week);
                    }

                    // broadcast event
                    if (promise) {
                        promise.then(function (res) {
                            $log.debug('Preload', scope.categories, res.data.length);
                            items = res.data;

                            //after loaded inject content
                            if (scope.active) {
                                $timeout(function() {
                                    scope.inject(null);
                                }, 1000);

                            }
                        });
                    }
                };

                // on click/hover load content
                scope.inject = function (event) {
                    $log.debug('Inject into', scope.container,'View', scope.view,'Items', items);

                    // skip if display is small
                    if (AgentService.isMobile()) {
                        // return false;
                    }

                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    if (items || scope.external ) {
                        EventManager.emit('menuInjectChange', {
                            container: scope.container,
                            external: scope.external,
                            view: scope.view,
                            href: href,
                            items: items
                        });
                    }

                };

                // set state
                EventManager.on('menuInjectChange', function (data) {
                    if (data.container === scope.container) {
                        if (data.href === href) {
                            scope.active = true;
                        } else {
                            scope.active = false;
                        }
                    }
                });

                // preload all
                scope.preload();
            }
        };
    }
)
/**
 * Container
 */
    .directive('menuContainer',
    function ($window, EventManager) {
        'use strict';

        return {
            templateUrl: '/templates/Framework/thumbnail_menu',
            replace: true,
            restrict: 'E',
            //transclude: true,
            scope: {
                id: '@'
            },
            link: function (scope, element, attrs) {
                scope.pageUrl = null;
                scope.view = '';
                scope.loading = false;
                scope.items = [];
                scope.href = '';
                scope.external = null;


                scope.link = function() {
                    event.stopPropagation();
                    event.preventDefault();
                    $window.location.href = scope.href;
                };

                // items loaded
                EventManager.on('menuInjectChange', function (data) {
                    if (data.container === scope.id) {
                        if (data.external) {
                            scope.external = data.external;
                            scope.items = [];
                            scope.loading = false;
                        } else {
                            scope.external = null;
                            scope.items = data.items;
                            scope.view = data.view;
                            scope.href = data.href;
                            scope.loading = false;
                        }
                    }
                });
            }
        };
    }
)
;
