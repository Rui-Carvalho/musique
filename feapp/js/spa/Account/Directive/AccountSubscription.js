angular.module('app.account')
	.directive('accountPersonalSubscription',
		function(EventManager, DataService, UrlService, AccountTemplates, NewsletterService) {
			'use strict';
			return {
				templateUrl: AccountTemplates.SUBSCRIPTION_COMPONENT,
				replace: true,
				restrict: 'E',
				scope: {
					channel: '@'
				},
				link: function(scope) {

					var currentSubscriptions = NewsletterService.getSubscriptions();
					scope.data = _.clone(currentSubscriptions);

					scope.handleClick = function () {

						var toSubscribe = _.difference(
								NewsletterService.getSubscriptionIds(scope.data),
								NewsletterService.getSubscriptionIds(currentSubscriptions)
						);
						var toUnSubscribe = _.difference(
								NewsletterService.getSubscriptionIds(currentSubscriptions),
								NewsletterService.getSubscriptionIds(scope.data)
						);

						return NewsletterService.handleSubscriptions({
							subscribe: toSubscribe,
							unsubscribe: toUnSubscribe
						})
						.then(function() {
							currentSubscriptions = NewsletterService.getSubscriptions();
							scope.data = _.clone(currentSubscriptions);
						});
					};

					scope.canSubmit = function() {
						return true;
					};
				}
			};
		}
	);
