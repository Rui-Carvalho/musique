angular.module('app.ui')
	.factory('UiPrefetchServiceFactory',
		function($http, $interval) {

			function PrefetchFactory(enabled) {
				'use strict';

				var self = this,
					templates = [],
					isEnabled = enabled,
					tick = 100,
					cleanInterval = null;

				this.load = function(newTemplates) {
					// convert object
					_.merge(
						templates,
						_.values(newTemplates)
					);

					// pass false to provider
					if (isEnabled) {
						this.run();
					}
				};

				this.run = function() {
					if (!cleanInterval) {
						cleanInterval = $interval(
							function() {
								if (_.isEmpty(templates)) {
									$interval.cancel(cleanInterval);

									cleanInterval = null;
								} else {
									self.prefetch(templates.shift());
								}
							}, tick);
					}
				};

				this.prefetch = function(template) {
					$http({
						method: 'GET',
						url: template
					});
				};
			}

			return PrefetchFactory;
		}
	)
	.provider('UiPrefetchService',
		function() {
			'use strict';

			var ENABLED = true;

			// set status
			this.enabled = function(status) {
				ENABLED = status;
			};

			this.$get = function(UiPrefetchServiceFactory) {
				return new UiPrefetchServiceFactory(ENABLED);
			};

		}
	)


;
