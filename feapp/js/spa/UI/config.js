angular.module('app.ui',
    [
    ]
)
.run(
    function (DomService, EventManager, UiEvents) {
        // global window click Event, prevent propagation on your own component using CSS or JS
        DomService.bind(
            'click',
            function () {
                EventManager.emit(
                    UiEvents.WINDOW_CLICK,
                    {
                        status: true
                    }
                );
            }
        );
    }
)
;
