angular.module('app.account')
.directive('accountApplicStatusComponent', function () {
		return {
			template: '<div ng-switch="status">'+

                        '<div ng-switch-when="sent" class="c_account-applic-status">' +
							'<div class="c_account-applic-status__static  s_flex-item-center  padding-right-xs-3  padding-right-xs-0">'+
								'<span class="icon-email-outline  icon--reset  color-gray-dark" ng-class="classIconSize ? classIconSize : \'very-large-font\'"></span>' +
							'</div>' +

							'<div class="c_account-applic-status__grow  s_flex-item-center  s_text-break">'+
								'<div class="text-label--set-3">Application Sent</div>'+
							'</div>' +
                        '</div>' +

                        '<div ng-switch-when="viewed" class="c_account-applic-status">' +
							'<div class="c_account-applic-status__static  s_flex-item-center  padding-right-xs-3  padding-right-xs-0">'+
								'<span class="icon-eye-outline  icon--reset  color-brand-success" ng-class="classIconSize ? classIconSize : \'very-large-font\'"></span>' +
							'</div>' +

							'<div class="c_account-applic-status__grow  s_flex-item-center  s_text-break">'+
								'<div class="text-label--set-3">Application Viewed</div>'+
							'</div>' +
                        '</div>' +

						// maybe they change mind
                        // '<div ng-switch-when="successful" class="vertical-align">' +
                        //     '<span class="icon-tick-outline  icon--reset  color-brand-success" ng-class="classIconSize ? classIconSize : \'very-large-font\'"></span>' +
                        //     '<div class="text-label--set-3">Application Successful</div>'+
                        // '</div>' +

						'<div ng-switch-when="unsuccessful" class="c_account-applic-status">' +
							'<div class="c_account-applic-status__static  s_flex-item-center  padding-right-xs-3  padding-right-md-0">'+
								'<span class="icon-cross-outline  icon--reset  color-gray-dark" ng-class="classIconSize ? classIconSize : \'very-large-font\'"></span>' +
							'</div>' +

							'<div class="c_account-applic-status__grow  s_flex-item-center  s_text-break">'+
								'<div class="text-label--set-3">Application Unsuccessful</div>'+
								'<span class="text-anchor--set-3" ng-click="viewMessage()">View Message</span>'+
							'</div>' +
                        '</div>' +

                    '</div>',
			replace: true,
			restrict: 'E',
			scope: {
                status: '@',
				classIconSize: '@' // if options increase separate with a templates
			},
			link: function (scope, element, attrs) {

			}
		};
	});
