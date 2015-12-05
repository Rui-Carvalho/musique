angular.module('app.nav',
    [
    ]
)
.run(
    function(DomService, EventManager) {
        'use strict';

        // set minimum time all emits inside that window will be prevented
        EventManager.tick('NavigationClose', 500);

        // prevent event to be fired instantly, pass ttl
        function closeAll () {
            EventManager.emit('NavigationClose', {});
        }

        function collapseDropDowns () {
            // send fake event in order to close all dropDowns
            EventManager.emit('NavigationChangeDropdown', {
                emitter: null,
                status: false
            });
        }

        DomService.bind('scroll', closeAll);
        DomService.bind('touchmove', closeAll);
        DomService.bind('click', collapseDropDowns);
    }
)
;
