angular.module('app.ui')
.directive('uiSwitchButton', function ($log, ChannelManager, UiEvents) {
		return {
			template: '<div class="inline-block">'+
				'<div class="c_switch-button  margin-right-xs-2" ng-class="{\'is-active\': componentStatus, \'is-disabled\':disabledState, \'animate-generic\': isAnimated}" ng-click="toggle($event)" style="vertical-align: sub;">'+
					'<small class="c_switch-button__controller" ng-class="{\'is-active\': componentStatus, \'animate-generic\': isAnimated}"></small>'+
				'</div>'+
				'<span class="text-label--set-3"  ng-class="{\'transparent-third\':disabledState}">{[{componentStatus ? statusOnLabel: statusOffLabel}]}</span>'+
			'</div>',
			replace: true,
			restrict: 'E',
			scope: {
				channel: '@',
				id: '@',
				status: '@',
				disabled: '@',
				statusOnLabel: '@',
				statusOffLabel: '@',
				lazy: '@' //do not change status immediately wait for a repaint
			},
			link: function (scope, element, attrs) {
				var ChannelEventManager = ChannelManager.subscribe(scope.channel),
					listeners = [],
					isLazy = scope.lazy === 'true'
				;

				scope.disabledState = scope.disabled === '1';
				scope.isAnimated = false;
				scope.componentStatus = (scope.status === 'true' || scope.status === '1');

				scope.toggle = function (event) {
					event.stopPropagation();
					event.preventDefault();

					//inject animation
					scope.isAnimated = true;

					if (!scope.disabledState) {
						ChannelEventManager.emit(
	                        UiEvents.CHANGE_SWITCH,
	                        {
	                            id: scope.id,
	                            status: !scope.componentStatus
	                        }
	                    );
					}
				};

				if (!scope.disabledState) {
					// listening for a CHANGE_SWITCH
					listeners.push(
						ChannelEventManager.on(
							UiEvents.CHANGE_SWITCH,
							function (data) {
								if (data.id === scope.id) {
									scope.componentStatus = data.status;
								}
							}
						)
					);
				}

				// tear-down
                scope.$on("$destroy", function() {
					_.forEach(
						listeners,
						function (removeListenerCallback) {
							removeListenerCallback();
						}
					);
                });

			}
		};
	});