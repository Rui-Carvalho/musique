angular.module('app.ui')
.directive('uiFormatNumber', function ($filter) {
		return {
			template: '<span ng-class="{\'text-danger\': !status}">{[{value}]}</span>',
			replace: true,
			restrict: 'E',
			scope: {
				model: '=',
				format: '@',
				precision: '@'
			},
			link: function (scope, element, attrs) {
				var toReplace = '{value}',
					bindOnce = scope.bindOnce === 'true',
					precision = parseInt(scope.precision) || 0,
					template = scope.format || toReplace
					;

				scope.value = null;

				scope.format = function (number) {
					var num = parseInt(number, 10);

					if (!isNaN(num)) {
						scope.status = true;
						scope.value = template.replace(
							toReplace,
							$filter('number')(num, precision)
						);
					} else {
						scope.status = false;
						scope.value = 'NA';
					}
				};


				scope.$watch('model', function (n, o) {
					scope.format(n);
				});

			}
		};
	});
