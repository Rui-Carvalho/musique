angular.module('app.ui')
.directive('uiShowOnstate', function ($state, $rootScope, DomService) {
	return {
		template: '<div><div ng-if="isState"><ng-transclude/></div></div>',
		replace: true,
		transclude: true,
		restrict: 'E',
		scope: {
			state: '@'
		},
		link: function (scope, element, attrs) {
			scope.isState = null;

			scope.checkState = function () {
				scope.isState = $state.is(scope.state);
			};

			// init
			scope.checkState();

			// detecting route change
			$rootScope.$on(
				'$stateChangeSuccess',
				function () {
					scope.checkState();
				}
			);

		}
	};
});