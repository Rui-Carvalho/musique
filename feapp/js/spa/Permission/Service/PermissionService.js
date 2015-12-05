angular.module('app.permission')
.service('PermissionService',
	function (AuthService, $q, PermissionRoles) {

		this.checkPermission = function (role, okCallback, koCallback) {
			var deferred = $q.defer(),
				user = AuthService.getPayload();

			if (user.roles) {
				if (_.indexOf(user.roles, role) > -1) {
					deferred.resolve(true);
				}
			}
			deferred.reject(false);

			return deferred.promise;
		};

		// does not get it from token
		this.isAdmin = function () {
			var user = AuthService.getPayload();
			return _.indexOf(user.roles, PermissionRoles.ADMIN) > -1;
		};
	}
)

// check if API is allowed and redirect to home if not
.factory('PermissionInterceptor', function (PermissionEvents, EventManager) {
    return {
        responseError: function (res) {
			// if not allowed
			if (res.status === 401) {
            	EventManager.emit(PermissionEvents.DENIED, {});
            }
        }
    };
})
;
