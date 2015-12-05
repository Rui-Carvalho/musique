angular.module('app.ui')
	.controller('StateGenericController',
		function($scope, $state, PermissionService, EventManager, $rootScope, HeaderEvents, stateParams) {
			var tearDown = null
			;

			$scope.changeStatus = function() {
				if (stateParams.state === $state.$current.name) { // @TODO check if is matching
					EventManager.emit(
						HeaderEvents.UPDATE, {
							title: stateParams.title,
							state: stateParams.parentState,
							breadcrumbs: stateParams.breadcrumbs
						}
					);
				}
			};

			PermissionService.checkPermission(stateParams.role) // pass from the caller
				.then(
					function(res) {
						tearDown = $rootScope.$on(
							'$stateChangeSuccess',
							function() {
								$scope.changeStatus();
							}
						);
						$scope.changeStatus();
					},
					function(res) {
						$state.go('app.home');
					}
				);


			$scope.$on('$destroy', function() {
				tearDown();
			});
		}
	);
