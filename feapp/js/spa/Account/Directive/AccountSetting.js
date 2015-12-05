angular.module('app.account')
.directive('accountPersonalSetting', function (ChannelManager, UiEvents, AccountTemplates, AccountPersonalSettingsFactory, FormServiceFactory, $q) {
	return {
		replace: true,
		templateUrl: AccountTemplates.COMPONENT_SETTING,
		restrict: 'E',
		scope: {
			id: '@',
			channel: '@'
		},
		link: function (scope, element, attrs) {
			// neede for forms
			scope.form = {};
			scope.data = {};

            var ChannelEventManager = ChannelManager.subscribe(scope.channel),
				accountPersonalSettingsApi = new AccountPersonalSettingsFactory(), // pass {userId: 121231} to force a user
				FormService = new FormServiceFactory(scope.form)
			;

			// use this with promiseButton
			scope.canSubmit = function () {
				return FormService.canSubmit();
			};

			scope.handleSave = function () {
				return accountPersonalSettingsApi
				.update(scope.data)
				.then(
					function (res) {
						// refresh data if something is wrong
						return res;
					},
					function (res) {
						// unable to save
						return $q.reject();
					}
				);
			};
		}
	};
});