angular.module('app.account', [
    ])
	.config(
		function($urlRouterProvider, $stateProvider, AccountTemplates, AuthEvents) {

			function controllerFactory(stateParams) {
				return function($scope, $controller, PermissionRoles) {
					stateParams.role = PermissionRoles.USER;
					$controller('StateGenericController', {
						$scope: $scope,
						stateParams: stateParams
					});
				};
			}

			$stateProvider
				.state('app.account', {
					url: '/account',
					template: '<ui-view/>',
					abstract: true,
					controller: controllerFactory({
						title: 'Profile Profile',
						state: 'app.account.personal.settings',
						breadcrumbs: 'Home'
					})
				})
				.state('app.account.personal', {
					url: '/personal',
					templateUrl: AccountTemplates.PERSONAL,
					redirectTo: 'app.account.personal.setting',
					controller: controllerFactory({
						title: 'Profile Personal',
						state: 'app.home',
						breadcrumbs: 'Home'
					})
				})
				.state('app.account.personal.setting', {
					url: '/settings',
					templateUrl: AccountTemplates.SETTING,
					controller: controllerFactory({
						title: 'Profile Settings',
						state: 'app.home',
						breadcrumbs: 'Home'
					})
				})
				.state('app.account.personal.subscription', {
					url: '/subscriptions',
					templateUrl: AccountTemplates.SUBSCRIPTION,
					controller: controllerFactory({
						title: 'Profile Subscriptions',
						state: 'app.home',
						breadcrumbs: 'Home'
					})
				})
				.state('app.account.personal.following', {
					url: '/following',
					templateUrl: AccountTemplates.FOLLOWING,
					controller: controllerFactory({
						title: 'Profile Following',
						state: 'app.home',
						breadcrumbs: 'Home'
					})
				})
				.state('app.account.applications', // it is outside personal tab
					{
						url: '/applications',
						templateUrl: AccountTemplates.APPLICATION_LIST,
						controller: controllerFactory({
							title: 'Applications',
							state: 'home',
							breadcrumbs: 'Home'
						})
					}
				);
		}
	)
	.run(
		function(UiPrefetchService, AccountTemplates, $rootScope, $state) {
			UiPrefetchService.load(AccountTemplates);

			$rootScope.$on('$stateChangeStart', function(evt, to, params) {
				if (to.redirectTo) {
					evt.preventDefault();
					$state.go(to.redirectTo, params);
				}
			});
		}
	);
