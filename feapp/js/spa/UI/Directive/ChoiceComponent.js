angular.module('app.ui')
.directive('uiChoiceComponent', function (ChannelManager, UiEvents) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: function (elm, attr) {
				if (attr.type) {
					return '/templates/Spa/UI:choice_component_'+ attr.type +'/';
				} else {
					return '/templates/Spa/UI:choice_component/';
				}
			},
			scope: {
				id: '@',
                status: '@',
                channel: '@',
				disabled: '@'
			},
			link: function (scope, element, attrs) {
				var ChannelEventManager = ChannelManager.subscribe(scope.channel);

				scope.componentStatus = parseInt(scope.status, 10) || 0;

				scope.handleSwitch = function (event, status) {
					event.stopPropagation();
					event.preventDefault();

					scope.componentStatus = status;

					if (!scope.disabled) {
						ChannelEventManager.emit(
	                        UiEvents.CHANGE_CHOICE,
	                        {
	                            id: scope.id,
	                            status: status
	                        }
	                    );
					}
				};

				// if (!scope.disabled) {
				// 	// listening for a CHANGE_SWITCH
				// 	ChannelEventManager.on(
				// 		UiEvents.CHANGE_CHOICE,
				// 		function (data) {
				// 			if (data.id === scope.id) {
				// 				scope.componentStatus = data.status;
				// 			}
				// 		}
				// 	);
				// }
			}
		};
	});
