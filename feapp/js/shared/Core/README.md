# Event Manager

This is an Utility Service to simplify communication between directives using a event pattern

## Global Channel

Inject 'EventManager' in your directive and use as follows

### Listen
```js
EventManager.on(
    KpiEvents.TO_CARD,
    function(data) {
        scope.payload = data.payload;
    }
);
```

### Emit
```js
EventManager.emit(
    KpiEvents.TO_CARD,
    {
        payload: 123
    }
);
```


## Named Channel

Use ChannelManager if you want to isolate events in a isolated pipe

### Create a new isolated EventManager
```js
var myEventManager = ChannelManager.subscribe('myChannel');
```


### Listen
```js
myEventManager.on(
    KpiEvents.TO_CARD,
    function(data) {
        scope.payload = data.payload;
    }
);
```

### Emit
```js
myEventManager.emit(
    KpiEvents.TO_CARD,
    {
        payload: 123
    }
);
```
