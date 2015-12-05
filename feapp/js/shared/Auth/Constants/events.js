angular.module('app.auth')
.constant('AuthEvents',
    {
        USER_CHANGED: 'userDataChanged',
        COMPANY_CHANGED: 'userCompanyDataChanged',
        PROTECT_CONTENT: 'modalStatusChange'
    }
)
;
