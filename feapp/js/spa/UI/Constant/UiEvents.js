angular.module('app.ui')
    .constant('UiEvents',
        {
        	CHANGE_FILTER: 'UiEventFilterChange',
            CHANGE_SWITCH: 'UiEventSwitchChange',
            LOAD_MORE: 'UiEventLoadMore',
            CHANGE_PAGINATION: 'UiChangePagination',
            UPDATE_PAGINATION: 'UiUpdatePagination',
            CHANGE_SWIPE: 'UiUpdateSwipe',
            CHANGE_BADGE: 'UiUpdateBadge',
            CHANGE_TAB: 'UiUpdateTab',
            CHANGE_SORT: 'UiUpdateSort',
            CHANGE_CHOICE: 'UiUpdateChoice',
            WINDOW_CLICK: 'UiWindowClick',
            REFRESH_ITEM: 'UiRefreshItem',
            SELECT_ITEM: 'UiSelectItem',
            CHANGE_ACTION: 'UiEventActionChange',
            REFRESH: 'UiEventRefresh'
        }
    )
;
