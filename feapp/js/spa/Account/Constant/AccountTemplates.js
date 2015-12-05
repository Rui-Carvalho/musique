angular.module('app.account')
	.constant('AccountTemplates', {
		PERSONAL: '/templates/Spa/Account:account_personal_template/',
		SETTING:'/templates/Spa/Account:account_personal_settings_template/',
		SUBSCRIPTION: '/templates/Spa/Account:account_personal_subscription_template/',
		SUBSCRIPTION_COMPONENT: '/templates/Spa/Account:Component:account_personal_subscriptions/',
		FOLLOWING: '/templates/Spa/Account:account_personal_follow_template/',
		FOLLOWING_COMPONENT: '/templates/Bof500/search_results/', // reuse the profile one
		APPLICATION_LIST: '/templates/Spa/Account:account_personal_application_template/',
		COMPONENT_APPLICATION: '/templates/Spa/Account:Component:account_personal_application/',
		COMPONENT_APPLICATION_MOBILE: '/templates/Spa/Account:Component:account_personal_application_mobile/',
		COMPONENT_SETTING: '/templates/Spa/Account:Component:account_personal_settings/'
	})
;
