angular.module('app.account')
	.directive('accountPersonalFollowing',
		function(EventManager, DataService, PaginationService, UrlService, SubscriptionService, AccountTemplates, UiEvents, ChannelManager) {
			'use strict';
			return {
				templateUrl: AccountTemplates.FOLLOWING_COMPONENT,
				replace: true,
				restrict: 'E',
				scope: {
					channel: '@'
				},
				link: function(scope) {

					var ChannelEventManager = ChannelManager.subscribe(scope.channel),
						lock = false,
						trackByKey = 'profile_id',
						filters = {
							offset: 0,
							limit: 8
						};

					/**
					 * Items
					 */
					scope.items = [];

					/**
					 * Handle search action
					 */
					scope.handleSearch = function(loadMore) {
						if (!lock) {
							lock = true;
							// perform search using filters
							SubscriptionService.getAll(filters)
								.then(
									function(res) {

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
											UiEvents.UPDATE_PAGINATION, {
												total: res.data.total,
												page: PaginationService.getPage(filters),
												limit: filters.limit
											}
										);

										lock = false;
									}
								);
						}
					};

					// get first page automatically
					scope.handleSearch();

					// from sorter, change order
					ChannelEventManager.on(
						UiEvents.CHANGE_PAGINATION,
						function(data) {
							PaginationService.setPage(filters, data.page);
							scope.handleSearch(false);
						}
					);

					// tear-down
					scope.$on("$destroy", function() {
						ChannelEventManager.destroy();
					});
				}
			};
		}
	);
