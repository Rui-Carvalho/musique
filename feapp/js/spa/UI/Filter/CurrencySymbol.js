angular.module('app.ui')
	.filter('currencySymbol',
		function() {
			return function(text) {

				var currency = {
					USD: "$",
					GBP: "£",
					AUD: "$",
					EUR: "€",
					CAD: "$",
					MIXED: "~"
				};

				return currency[text];
			};
		}
	);