# Gulp

Gulp commands reference, before proceeding be sure you have all the node modules required

```
npm install
```

## Development

Executes all tasks

```
gulp dev --app=site
gulp dev --app=spa
```

Executes only specific ones

```
gulp dev-inject-js --app=site
gulp dev-css --app=spa
```

## Production

Executes all tasks

```
gulp dist --app=site
gulp dist --app=spa
```

Force legacy support

```
gulp dist --app=site -l
```

# Application Config

This is a small guideline about how to configure modules.json in order to inject dependencies into AngularJs

## Install a lib

```
bower install <libname> --save
```

## Configure modules.json

```json
{
    "libs": {
        "lodash": ["assets/vendor/lodash/lodash.js"],
        "moment": ["assets/vendor/moment/moment.js"],
        "chart": ["assets/vendor/Chart.js/Chart.js"],
        "aes": ["assets/vendor/cryptojslib/rollups/aes.js"],
        "ecb": ["assets/vendor/cryptojslib/rollups/mode-ecb.js"],
        "pusher": ["assets/vendor/pusher/dist/pusher.js"],
        "json2": ["assets/vendor/pusher/dist/json2.js"],
        "sockjs": ["assets/vendor/pusher/dist/sockjs.js"],
        "angular": ["assets/vendor/angular/angular.js"]
    },
    "angular": {
        "ngResource": ["assets/vendor/angular-resource/angular-resource.js"],
        "ngTouch": ["assets/vendor/angular-touch/angular-touch.js"],
        "ngStorage": ["assets/vendor/ngstorage/ngStorage.js"],
        "ngCookies": ["assets/vendor/angular-cookies/angular-cookies.js"],
        "ngAnimate": ["assets/vendor/angular-animate/angular-animate.js"],
        "ngSanitize": ["assets/vendor/angular-sanitize/angular-sanitize.js"],



        "app.permission": ["assets/js/spa/Permission/config.js", "assets/js/spa/Permission/*/*.js"],
        "app.job": ["assets/js/spa/Job/config.js", "assets/js/spa/Job/*/*.js"],
        "app.kpi": ["assets/js/spa/Kpi/config.js", "assets/js/spa/Kpi/*/*.js"],
        "app.ui": ["assets/js/spa/UI/config.js", "assets/js/spa/UI/*/*.js"]
    },
    "bootstrap": {
        "config": ["assets/js/spa/modules.js"],
        "app": ["assets/js/spa/app.js"]
    },
    "build": {
        "development": {
            "folder": "src/BOF/SpaBundle/Resources/views/Partials/dev",
            "js": "js.html.twig"
        },
        "production": {
            "folder": "src/BOF/SpaBundle/Resources/views/Partials/dist",
            "js": "js.html.twig"
        }
    }
}

```


### libs

Are all the third party libs used by AngularJs but not dependent on it

### angular

Are all the libs used by AngularJs

Key is the **module name** and value is the **path** when file resides

### bootstrap

Are file needed to configure and start up AngularJs Application, this modules are not injected as dependencies

### build

Self explanatory
