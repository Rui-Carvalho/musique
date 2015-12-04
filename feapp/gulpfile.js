'use strict';
var argv = require('yargs').argv;

if (typeof argv.app == "undefined") {
    console.log("Please specify an app with --app=site");
    process.exit(0);
}

var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    inject      = require('gulp-inject'),
    rev         = require('gulp-rev'),
    annotate    = require('gulp-ng-annotate'),
    cssminify   = require('gulp-minify-css'),
    prefix      = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    replace     = require('gulp-replace'),
    del         = require('del'),
    parseArgs   = require('minimist'),
    gulpif      = require('gulp-if'),
    gutil       = require('gulp-util'),
    csso        = require('gulp-csso'),
    debug       = require('gulp-debug'),
    livereload  = require('gulp-livereload'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    file        = require('gulp-file'),
    _           = require('lodash'),
    fs          = require('fs'),
    buildConfig = require('./js/' + argv.app + '/modules.json')
;

require('gulp-stats')(gulp);
var domain  = (argv.domain) ? '//'+ argv.domain : '//oyst.project';
var gulp_src = gulp.src; // https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
    })
  );
};


// needed to keep order in dependency load
function mergeArray (values) {
    var result = [];

    // walk the multidimensional array
    values.forEach(
        function (items) {
            // zip items
            items.forEach(
                function (item, index) {
                    if (!result[index]) {
                        result[index] = [];
                    }
                    result[index].push(item);
                }
            );
        }
    );
    return _.flatten(result);
}

// CONFIG ---------------------------
var bootstrapFiles = _(buildConfig.bootstrap).values().flatten().value(),
    libFiles = _(buildConfig.libs).values().flatten().value(),
    angularFiles = mergeArray(_(buildConfig.angular).values().value()),
    angularMods = _(buildConfig.angular).keys().value(),
    customJs = _.union(angularFiles, bootstrapFiles), //only for jshint
    fileList = _.union(libFiles, customJsNew),
    fontList = ['vendor/boostrap-sass/assets/fonts/bootstrap/*'],
    phpViews = 'src/OYST/**/views/**/*.html.twig',
    scssSource = 'scss/**/*.scss',
    dev = {
        inject: buildConfig.build.development.folder,
        css_inject_file: 'css.html.twig',
        footer: buildConfig.build.development.folder + '/' + buildConfig.build.development.js,
        css: 'css', //path to css files
        fonts: 'fonts', //path to fonts
        scss: 'scss/main.scss', //path to 'include all' sass file
        js: '',
        app: 'app.js',
        domain: ''
    },
    dist = {
        inject: buildConfig.build.production.folder,
        css_inject_file: 'css.html.twig',
        footer: buildConfig.build.production.folder + '/' + buildConfig.build.production.js,
        css: 'web/assets/css',
        fonts: 'web/assets/fonts',
        scss: 'assets/scss/main.scss',
        js: 'web/assets/js',
        app: argv.app + '-app.js',
        domain: domain
    },
    localhost = 'http://oyst.project/';

    //create file for angular app
    fs.writeFileSync(buildConfig.bootstrap.config[0], "var angularModules = ['" + angularMods.join("', '") + "'];");

// transform path before replacing path
var assetPathTransformation = function (domain, originalPath, targetPath){
    var original_path = 'web/', target_path='web/assets/'
    return {
        transform: function (filepath, file, i, length) {
            return inject.transform.apply(inject.transform, arguments)
                    .replace(original_path, target_path)
                    .replace('/web', '');
        }
    };
};

// TASKS ---------------------------
// This task will create the initial inject files used by symfony2 ----------------------------------------
function createInjectFiles(destinationFile, destinationDir, type) {
    return file(
        destinationFile,
        '<!-- inject:' + (type ? type : 'css') + ' -->\n<!-- endinject -->\n',
        { src: true }
    ).pipe(gulp.dest(destinationDir));
}

gulp.task('dev-create-inject', ['dev-create-inject-js','dev-create-inject-css']);
gulp.task('dist-create-inject', ['dist-create-inject-js','dist-create-inject-css']);

gulp.task('dev-create-inject-js', function () {
    return createInjectFiles(buildConfig.build.development.js, buildConfig.build.development.folder, 'js');
});
gulp.task('dev-create-inject-css', function () {
    return createInjectFiles(dev.css_inject_file, buildConfig.build.development.folder, 'css');
});
gulp.task('dist-create-inject-js', function () {
    return createInjectFiles(buildConfig.build.production.js, buildConfig.build.production.folder, 'js');
});
gulp.task('dist-create-inject-css', function () {
    return createInjectFiles(dist.css_inject_file, buildConfig.build.production.folder, 'css');
});


gulp.task('lint-js', function () {
    // remove vendor libs
    var libs = [];
    customJs.forEach(
        function (path) {
            if (path.indexOf('vendor') === -1) {
                libs.push(path);
            }
        }
    );

    return gulp.src(libs)
        .pipe(debug({title: 'lint:'}))
        .pipe(jshint(
            {
                undef: true,
                browser: true,
                newcap: false,
                globals: {
                    angular: true,
                    geoip2: true,
                    CryptoJS: true,
                    crc32: true,
                    FileList: true,
                    _: true,
                    angularModules: true,
                    Pusher: true,
                    moment: true,
                    d3: true
                }
            }
        ))
        .pipe(jshint.reporter('default'));
});

gulp.task('livereload-html', function () {
    livereload();

    // setTimeout(function () {
    //     livereload();
    // }, 1000);
});

gulp.task('livereload-js', function () {
    return gulp.src(customJs)
        .pipe( livereload() );
});

gulp.task('dist-js', function () {
    return gulp.src(fileList)
        .pipe(concat(dist.app))
        .pipe(replace('DEV = true', 'DEV = false'))
        .pipe(annotate())
        .pipe(uglify())
        .pipe(gulp.dest(dist.js))
        ;
});

// ------- CSS Tasks -------
gulp.task('dev-inject-css', function () {
    return gulp.src(buildConfig.build.development.folder +'/'+ dev.css_inject_file)
        .pipe(inject(
            gulp.src(dev.css + '/*'),
            assetPathTransformation(dev.domain, '', '')
        ))
        .pipe(gulp.dest(dev.inject));
});

gulp.task('dev-inject-js', function () {
    return gulp.src(dev.footer)
        .pipe(inject(
            gulp.src(fileList),
            assetPathTransformation(dev.domain, '', '')
        ))
        .pipe(gulp.dest(dev.inject));
});

gulp.task('dist-inject-css', function () {
    if (dist.footer) {
        return gulp.src(buildConfig.build.production.folder +'/'+ dist.css_inject_file)
            .pipe(inject(
                gulp.src(dist.css + '/*'),
                assetPathTransformation(dist.domain, '', '')
            ))
            .pipe(gulp.dest(dist.inject));
    }
});

gulp.task('clean', function () {
    del(
        [
            dist.css,
            dist.js
        ]
    );
});

gulp.task('dist-inject-js', function () {
    if (dist.footer) {
        return gulp.src(dist.footer)
        .pipe(inject(
            gulp.src(dist.js + '/' + argv.app + '*'),
            assetPathTransformation(dist.domain)
        ))
        .pipe(gulp.dest(dist.inject));
    }
});

gulp.task('dev-css', function () {
    return gulp.src(dev.scss)
        .pipe(debug({title: 'sass:'}))
        .pipe(sass({errLogToConsole: true}))
        .pipe(prefix({
            browsers: ['last 3 versions', '> 1%', 'ie 8', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        // .pipe(csso())
        .pipe(gulp.dest(dev.css));
});

gulp.task('dev-css-sm', function () {
    return gulp.src(dev.scss)
        .pipe(debug({title: 'sass:'}))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dev.css))
        .pipe(livereload());
});

gulp.task('dist-css', function () {
    return gulp.src(dist.scss)
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 3 versions', '> 1%', 'ie 8', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(cssminify({processImport: false}))
        .pipe(csso()) // problem remove s on properties
        .pipe(gulp.dest(dist.css));
});

gulp.task('dev-copy-fonts', function () {
    return gulp.src(fontList)
        .pipe(gulp.dest(dev.fonts));
});


// Build
gulp.task('dev', function () {
    return runSequence(
        [
            'lint-js',
            'dev-create-inject',
            'dev-css',
            'dev-copy-fonts'
        ],
        [
            'dev-inject-js',
            'dev-inject-css'
        ]
    );
});

gulp.task('dist',
    function () {
            runSequence(
                [
                    // 'clean', // CANNOT RUN CLEAN HERE BECAUSE OF DEPLOY AFTERWARDS
                    'dist-create-inject',
                    'lint-js'
                ],
                [
                    'dist-js',
                    'dist-css'
                ],
                [
                    'dist-inject-js',
                    'dist-inject-css'
                ]
            );
    }
);

gulp.task('default', function () {
    livereload.listen();

    runSequence(['dev']);

    gulp.watch(scssSource, ['dev-css']);
    gulp.watch(angularFiles, ['livereload-js']);
    gulp.watch(phpViews, phpLivereload);
});

gulp.task('default-sm', function () {
    livereload.listen();

    runSequence(['dev','dev-css-sm']);

    gulp.watch(scssSource, ['dev-css-sm']);
    gulp.watch(angularFiles, ['livereload-js']);
    gulp.watch(phpViews, phpLivereload);
});


// functions
function phpLivereload (objWatch) {
    var pathClean = objWatch.path.replace('/var/www/access-layer-app/','');
    var index = pathClean.lastIndexOf("/");
    var parentFolders = pathClean.slice(0,index);
    var fileName = pathClean.slice(index);
    var msgStatus = 'PHP View has ' + objWatch.type + ': ';

    gutil.log(
        'gulp-watch: ' +
        gutil.colors.green( msgStatus ) +
        gutil.colors.magenta( parentFolders ) +
        fileName
    );

    livereload.reload( localhost );
}
