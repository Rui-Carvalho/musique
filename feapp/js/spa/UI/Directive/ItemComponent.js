angular.module('app.ui')
	.directive('uiItemComponent', function(ChannelManager, UiEvents, $animate) {
		return {
			template: '<div ng-click="handleClick($event)" ng-class="{\'box-shadow-medium\': status, \'box-shadow-light\': !status}" ng-transclude></div>',
			replace: true,
			transclude: true,
			restrict: 'E',
			scope: {
				channel: '@',
				id: '@'
			},
			link: function(scope, element, attrs) {
				var ChannelEventManager = ChannelManager.subscribe(scope.channel),
					listeners = [];
					
				scope.status = 0;

				scope.handleClick = function() {
					ChannelEventManager.emit(
						UiEvents.SELECT_ITEM, {
							id: scope.id,
							status: true
						}
					);
				};

				listeners.push(
					ChannelEventManager.on(
						UiEvents.SELECT_ITEM,
						function(data) {
							scope.status = data.id === scope.id;
						}
					)
				);

				listeners.push(
					ChannelEventManager.on(
						UiEvents.REMOVE_ITEM,
						function(data) {

							// emulate animation
							if (data.id === scope.id) {

								element.addClass('animate-default');
								$animate
									.leave(element)
									.then(
										function() {
											ChannelEventManager.emit(
												UiEvents.REFRESH, {
													//
												}
											);
										}
									);
							}
						}
					)
				);

				// tear-down
				scope.$on("$destroy", function() {
					_.forEach(
						listeners,
						function(removeListenerCallback) {
							removeListenerCallback();
						}
					);
				});

			}
		};
	});
