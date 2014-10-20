var gulp = require('gulp'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    livereload = require('gulp-livereload')
    //es6module = require('gulp-es6-module-transpiler'),
    //es6 = require('gulp-es6-transpiler'),
    es6traceur = require('gulp-traceur'),
    sourcemaps = require('gulp-sourcemaps');

// Config
var config = {
    src: {
        html: ['www/**/*.html'],
        scss: ['www/style/*.scss'],
        lib: ['www/lib/**'],
        images: ['www/images/**'],
        js: ['www/scripts/**/*.js', 'www/scripts/**/*.json'],
        libs: [
//            'www/lib/curl/dist/debug/curl.js',
            'www/lib/curl/dist/curl/curl.js',
//            'www/lib/curl/src/curl/plugin/domReady.js',
            //'www/lib/lazy.js/lazy.js',
            'www/lib/requestAnimationFrame-polyfill/requestAnimationFrame.js'
        ]
    },
    dest: {
        dev: {
            html: 'build/dev/www',
            scss: 'build/dev/www/style',
            fonts: 'build/dev/www/fonts',
            lib: 'build/dev/www/lib',
            images: 'build/dev/www/images',
            js: 'build/dev/www/scripts'
        },
        dist: {
            html: 'build/dist/www',
            scss: 'build/dist/www/style',
            fonts: 'build/dist/www/fonts',
            lib: 'build/dist/www/lib',
            images: 'build/dist/www/images',
            js: 'build/dist/www/scripts'
        }
    },
    /*
    jslint: (function() {
        var opts = {
            dev: {
                browser: true,
                devel: true,
                'continue': true,
                debug: true,
                plusplus: true,
                regexp: true,
                predef: ['curl', 'define', 'Lazy'],
                white: true,
                nomen: true,
                vars: true,
                todo: true
            }
        };

        opts.dist = Object.create(opts.dev);
        opts.dist.devel = false;
        opts.dist.debug = false;
        opts.dist.todo = false;

        return opts;
    }()),
    */
    uglify: {

    },
    minifyHtml: {
        empty: true, // do not remove empty attributes
        cdata: true, // do not strip CDATA from scripts
        conditionals: true, // do not remove conditional internet explorer comments
        spare: true // do not remove redundant attributes
    },
    minifyCss: {
        keepSpecialComments: false,
        keepBreaks: false,
        removeEmpty: true
    },
    compass: {
        project: path.join(__dirname, 'www', 'src'),
        sass: 'style',
        css: '../build/dev/style',
        style: 'expanded',
        require: ['sass-globbing'],
        import_path: 'lib'
    }
};


//  Tasks
gulp.task('clean', function () {
    // gulp.src('build/**', {read: false})
    //     .pipe(clean());
});

gulp.task('libs', function() {
    gulp.src(config.src.libs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(config.dest.dev.lib))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest.dist.lib));
});

gulp.task('copy', function () {
//  gulp.src([
//      'www/src/lib/bootstrap-sass/fonts/**',
//      'www/src/lib/font-awesome/fonts/**'
//    ])
//    .pipe(gulp.dest(config.dest.dev.fonts))

    gulp.src(config.src.lib)
        .pipe(gulp.dest(config.dest.dev.lib));

    gulp.src(config.src.html)
        .pipe(gulp.dest(config.dest.dev.html));

    gulp.src(config.src.js)
        .pipe(gulp.dest(config.dest.dev.js));

    gulp.src(config.src.images)
        .pipe(gulp.dest(config.dest.dev.images))
        .pipe(gulp.dest(config.dest.dist.images));
});

// gulp.task('es6', function() {
//     gulp.src(config.src.js)
//         .pipe(sourcemaps.init())
//         .pipe(es6traceur({
//             modules:'amd'
//         }))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(config.dest.dev.js))
// });

gulp.task('js', function() {
    gulp.src(config.src.js)
        .pipe(sourcemaps.init())
        .pipe(es6traceur({
            modules:'amd'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest.dev.js))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest.dist.js));
});

// gulp.task('compass', function () {
//     gulp.src(config.src.scss)
//         .pipe(compass(config.compass))
//         .pipe(minifyCss(config.minifyCss))
//         .pipe(gulp.dest(config.dest.dist.scss))
// });

gulp.task('default', ['libs', 'jslint', 'copy', 'compass']);

//#gulp.task 'watch', ['default'], ->
// gulp.task('watch', function () {
//     watch({glob: config.src.scss})
//         .pipe(plumber())
//         .pipe(compass(config.compass))
//         .pipe(plumber());

//     watch({glob: config.src.js})
//         .pipe(plumber())
//         .pipe(jslint(config.jslint.dev))
//         .pipe(plumber())
//         .pipe(gulp.dest(config.dest.dev.js))
//         .pipe(plumber());

//     server = livereload();
//     gulp.watch('build/dev/www/**').on('change', function (file) {
//         server.changed(file.path);
//     });
// });