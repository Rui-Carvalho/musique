angular.module('app.ui')
.directive('uiRadioTab', function (ChannelManager, UiEvents, $state) {
		return {
			template: '<span ng-class="{\'active\': status}" ng-click="handleClick($event)" class="cursor-pointer s_horizontal-list--block__item  text-navigation--set-1" ng-transclude></span>',
			replace: true,
			transclude: true,
			restrict: 'E',
			scope: {
				channel: '@',
				id: '@',
				enabled: '@'
			},
			link: function (scope, element, attrs) {
				var ChannelEventManager = ChannelManager.subscribe(scope.channel);

				scope.status = scope.enabled === 'true';

				scope.handleClick = function (event) {
					ChannelEventManager.emit(
						UiEvents.CHANGE_TAB,
						{
							id: scope.id,
							status: scope.status
						}
					);
				};

				// reset others
				ChannelEventManager.on(
					UiEvents.CHANGE_TAB,
					function (data) {
						scope.status = data.id === scope.id;
					}
				);

				// init first status and filter
				if (scope.status) {
					scope.handleClick();
				}

			}
		};
	});
