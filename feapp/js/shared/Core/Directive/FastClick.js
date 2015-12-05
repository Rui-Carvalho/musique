angular.module('app.core')
.directive('fastClick',
	function () {
        'use strict';
		return {
			restrict: 'A',
			link: function (scope, element) {
				/**
				 * Do not remove, this is an HACK to prevent input blurring while tapped , NgTouch bug
				 */
				element.bind('touchend', function (event) {
					event.stopPropagation();
				});
			}
		};
	}
)
;
