angular.module('app.ui')
.directive('uiFixedNav', function (ChannelManager, EventManager, NavigationManager, DomService) {
	return {
		template: '<div class="o_layout-side-body__fixed-container"><div class="o_layout-side-body__fixed-offset" ng-style="customStyle" ng-class="{\'is-active\':status}" ng-transclude></div></div>',
		replace: true,
		transclude: true,
		restrict: 'E',
		scope: {
			offset: '@',
			relative: '@'
		},
		link: function (scope, element, attrs) {
			var
				container = element[0],
				nav = container.childNodes[0],
				topOffset = parseInt(scope.offset, 10) || 0,
				blockHeight = parseInt(scope.height, 10) || 0,
				listenerOff = null;

			// public
			scope.status = false;

			// init
			scope.customStyle = {
				top: topOffset + 'px'
			};

			// if (!scope.lazy) {
			// 	container.style.height = blockHeight ? blockHeight + 'px' : DomService.getHeight(nav);
			// }

            listenerOff = NavigationManager.onChange(
                function (data) {
                    if (data.container === 'main') {
                        scope.status = data.value;
                    }
                }
            );

			scope.$on("$destroy", function() {
              listenerOff();
            });
		}
	};
});
