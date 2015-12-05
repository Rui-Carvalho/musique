angular.module('app.ui')
.directive('uiActionComponent', function (ChannelManager, UiEvents) {
		return {
            template: '<div ng-click="handleClick($event)" ng-transclude></div>',
			replace: true,
			transclude: true,
			restrict: 'E',
			scope: {
				channel: '@',
				id: '@',
				value: '@',
				flip: '@',
				action: '@'
			},
			link: function (scope, element, attrs) {
				var ChannelEventManager = ChannelManager.subscribe(scope.channel),
                	listeners = [],
					flipStatus = scope.flip === 'true';

				scope.status = scope.value === '1' || scope.value === 'true';

                scope.handleClick = function (event) {
					event.preventDefault();
					event.stopPropagation();

                    ChannelEventManager.emit(
    					UiEvents.CHANGE_ACTION,
    					{
                            id: scope.id,
                            status: flipStatus? !scope.status : scope.status,
							action: scope.action
                        }
    				);
                };

			}
		};
	});
