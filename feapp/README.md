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
        "lodash": ["vendor/lodash/lodash.js"],
        "moment": ["vendor/moment/moment.js"],
        "aes": ["vendor/cryptojslib/rollups/aes.js"],
        "ecb": ["vendor/cryptojslib/rollups/mode-ecb.js"],
        "angular": ["vendor/angular/angular.js"]
    },
    "angular": {
        "ngResource": ["vendor/angular-resource/angular-resource.js"],
        "ngTouch": ["vendor/angular-touch/angular-touch.js"],
        "ngStorage": ["vendor/ngstorage/ngStorage.js"],
        "ngCookies": ["vendor/angular-cookies/angular-cookies.js"],
        "ngAnimate": ["vendor/angular-animate/angular-animate.js"],
        "ngSanitize": ["vendor/angular-sanitize/angular-sanitize.js"],

        "app.permission": ["js/spa/Permission/config.js", "js/spa/Permission/*/*.js"],
        "app.ui": ["js/spa/UI/config.js", "js/spa/UI/*/*.js"]
    },
    "bootstrap": {
        "config": ["js/spa/modules.js"],
        "app": ["js/spa/app.js"]
    },
    "build": {
        "development": {
            "folder": "src/MUSIQUE/SpaBundle/Resources/views/Partials/dev",
            "js": "js.html.twig"
        },
        "production": {
            "folder": "src/MUSIQUE/SpaBundle/Resources/views/Partials/dist",
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
