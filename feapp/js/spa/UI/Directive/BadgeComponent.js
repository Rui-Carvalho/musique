angular.module('app.ui')
.directive('uiBadge', function (ChannelManager, UiEvents, $timeout) {
		return {
			template: '<span ng-class="{\'is-animating\': status}">{[{value}]}</span>',
			replace: true,
			restrict: 'E',
			scope: {
				channel: '@',
				id: '@',
				duration: '@'
			},
			link: function (scope, element, attrs) {
				var ChannelEventManager = ChannelManager.subscribe(scope.channel),
					duration = scope.duration ? parseInt(scope.duration) : 2000;

				scope.status = false;
				scope.value = '';

				ChannelEventManager.on(
					UiEvents.CHANGE_BADGE,
					function (data) {
						/**
						filter badges by id
						{
							id: 'badge1',
							value: 123
						}
						*/
						if (data.id === scope.id) {
							scope.value = data.value;
							scope.status = true;
						}

						// disable animation
						$timeout(
							function () {
								scope.status = false;
							},
							duration
						);
					}
				);

			}
		};
	});
