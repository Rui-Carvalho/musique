angular.module('app.account')
.directive('accountPersonalApplication', function ($window, $state, $stateParams, $q, EventManager, ChannelManager, AuthEvents, UiEvents, AccountTemplates, AgentService, AccountApplicationApiFactory, FormServiceFactory, DataService, PaginationService, PusherService) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: function(){
				return AgentService.isMobile() ? AccountTemplates.COMPONENT_APPLICATION_MOBILE : AccountTemplates.COMPONENT_APPLICATION;
			},
			scope: {
				id: '@',
				channel: '@'
			},
			link: function (scope, element, attrs) {
				var eventList = [],
                	currentUser = {},
                    PusherChannelManager = PusherService.subscribeToAll('my_channel'), // just a test here
                    ChannelEventManager = ChannelManager.subscribe(scope.channel),
                    applicationApi = new AccountApplicationApiFactory(),
                    trackByKey = 'job_application_id',
                    filters = {
                        offset: 0,
                        limit: 10,
                        order: 'created_datetime',
                        query: {
							//decorate:'job_company'
						}
                    };

                scope.pusherData = {};
                scope.order = null;
                scope.items = [];
                scope.filterBy = null;

                // get id and params from the route
                scope.params = $stateParams;

                //call API
                scope.handleSearch = function (loadMore) {

                    applicationApi.get(filters)
                    .then(
                        function (res) {

                            // concat or replace
                            if (loadMore) {
                                scope.items = DataService.addTrackBy(
                                    scope.items.concat(res.data.results),
                                    trackByKey
                                );
                            } else {
                                scope.items = DataService.addTrackBy(
                                    res.data.results,
                                    trackByKey
                                );
                            }

                            // update pagination
                            ChannelEventManager.emit(
                                UiEvents.UPDATE_PAGINATION,
                                {
                                    total: res.data.total,
                                    page: PaginationService.getPage(filters),
                                    limit: filters.limit
                                }
                            );
                        }
                    );
                };

                // refresh single row by jobId
                scope.refreshRow = function (jobId) {
                    applicationApi.getOne(jobId)
                    .then (
                        function (res) {
                            DataService.addTrackBy(res.data, trackByKey);
                            DataService.replace(scope.items, res.data, trackByKey);
                        }
                    );
                };

                // init
                scope.handleSearch();

                // listen to Pusher messages dispatched form EventManager
            	PusherChannelManager.on(
                	'new_message',
                	function (data) {
                		scope.pusherData = data;
                	}
                );

                EventManager.on(
                    AuthEvents.COMPANY_CHANGED,
                    function (data) {
                        // I could even use without event in this way
                        // scope.company_slug = CompanyService.getCurrent().profile_slug;
                        // or scope.company = CompanyService.getCurrent();
                        scope.company_slug = data.company.profile_slug;
                    }
                );

                // from sorter, change order
                ChannelEventManager.on(
                    UiEvents.CHANGE_SORT,
                    function(data) {
                        PaginationService.reset(filters);
                        filters.order = data.order;
                        scope.handleSearch(false);
                    }
                );

                // from sorter, change order
                ChannelEventManager.on(
                    UiEvents.CHANGE_PAGINATION,
                    function(data) {
                        PaginationService.setPage(filters, data.page);
                        scope.handleSearch(false);
                    }
                );

                // loadMore
                ChannelEventManager.on(
                    UiEvents.LOAD_MORE,
                    function (data) {
                        PaginationService.nextPage(filters);
                        scope.handleSearch(true);
                    }
                );

                // row selected
                ChannelEventManager.on(
                    UiEvents.SELECT_ITEM,
                    function (data) {

                        //get details
                        var selected = _.find(
                            scope.items,
                            {
                                job_id: data.id
                            }
                        );

                        // select if internal/external
                        if (selected) {
                            if (selected.is_external == '1') {
                                $window.open(selected.external_url, '_blank'); //external_url
                            } else {
                                $state.go('app.company.job.applications', {jobId: selected.job_id});
                            }
                        }
                    }
                );

                // tear-down
                scope.$on("$destroy", function() {
                   ChannelEventManager.destroy();
                });
			}
		};
	});
