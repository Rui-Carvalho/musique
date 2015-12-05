angular.module('app.ui')
.directive('uiViewContainer', function ($state, $rootScope, DomService) {
		return {
			template: '<div class="s_hide-view" ng-style="customStyle" ng-class="{\'is-active\': status}" ng-transclude></div>',
			replace: true,
			transclude: true,
			restrict: 'E',
			scope: {
				state: '@',
				offset: '@'
			},
			link: function (scope, element, attrs) {
				var resizeListener = null,
					customStyle = {};

				scope.status = scope.state === undefined;

				// calculate offset
				scope.repaint = function () {
					scope.customStyle = {
						height: DomService.getHeight() - DomService.getTop(element[0]) + 'px'
					};
				};

				scope.offset = DomService.getTop(element[0]);

				scope.changeStatus = function () {
					if (scope.state) {
						scope.status = $state.is(scope.state);
					}
				};

				// detecting route change
				$rootScope.$on(
					'$stateChangeSuccess',
					function () {
						scope.changeStatus();
					}
				);

				// init component
				scope.changeStatus();
				scope.repaint();


				// listerners here
				resizeListener = DomService.bind('resize', function () {
					scope.repaint();
					scope.$apply();
				});

				scope.$on("$destroy", function() {
                //    resizeListener();
                });

			}
		};
	});
