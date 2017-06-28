/*
 * Main Gulpfile for Laravel projects
 * Cyber-Duck Ltd - www.cyber-duck.co.uk
 */

var gulp = require('gulp'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    minify = require('gulp-cssnano'),
    imageop = require('gulp-image-optimization'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    babel = require("gulp-babel");
    // sync = require('browser-sync').create()



/*
 * Main configuration object
 */
var config = {
    scssDir: './src/Project/BoE/code/assets/scss',
    jsSrc: './src/Project/BoE/code/assets/js/src',
    jsDest: './src/Project/BoE/code/assets/js/min',
    cssDir: './src/Project/BoE/code/assets/css',
    imgSrc: './src/Project/BoE/code/assets/img'
};




/*
 * Compile Sass for development
 * with sourcemaps and not minified
 */
gulp.task('cd:style-dev', function () {
    'use strict';
    gulp.src(config.scssDir + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 4 versions', 'IE 9'], cascade: false}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.cssDir));
        // .pipe(sync.stream());
});



/*
 * Compile Sass for production
 * with no sourcemaps and minified
 */
gulp.task('cd:style', () => {
    'use strict';
    gulp.src(config.scssDir + '/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 4 versions', 'IE 9'], cascade: false}))
        .pipe(minify({
            autoprefixer: {
                browsers: 'last 4 versions, IE 9'
            },
            zindex: false, 
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(gulp.dest(config.cssDir));
});



/*
 * Concatenate and transpile JS files
 */
gulp.task('cd:js', () => {
    'use strict';
    return gulp.src([
        config.jsSrc + '/*.js'
    ])
        .pipe(sourcemaps.init())
        // .pipe(babel())
        .on('error', function(e) {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.jsDest));
});



/*
 * Compress and rename JS files
 */
gulp.task('cd:compress', ['cd:js'], () => {
    'use strict';
    return gulp.src(config.jsSrc + '/scripts.js')
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDest + '/min'));
});


/*
 * Clean non used JS files, and sourcemaps for production
 */
gulp.task('cd:clean', ['cd:style', 'cd:compress'], () => {
    'use strict';
    del(config.cssDir + '/maps/*');
    del(config.cssDir + '/maps/');
    // del(config.jsDest + '/scripts.js');
    del(config.jsDest + '/scripts.js.map');
});



/*
 * Optimise images uploaded in the CMS
 */
gulp.task('cd:imgoptim', (cb) => {
    'use strict';
    return gulp.src([
        config.imgSrc + '/**/*.png',
        config.imgSrc + '/**/*.jpg',
        config.imgSrc + '/**/*.gif',
        config.imgSrc + '/**/*.jpeg'
    ])
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.imgSrc)).on('end', cb).on('error', cb);
});



/*
 * Production task
 * Compiles Sass with no sourcemaps, minifies CSS
 * Compress JS
 * Clean sourcemaps and uncompressed JS
*/
gulp.task('cd:build', () => {
    'use strict';
    gulp.start('cd:style');
    gulp.start('cd:compress');
    gulp.start('cd:clean');
});



/*
 * Reload task for JS files used by BrowserSync
 */
// gulp.task('js-sync', ['js'], () => {
//     'use strict';
//     sync.reload();
// });



/*
 * BrowserSync task, contains watchers for Sass, JS and Templates
 */
// gulp.task('browsersync', ['style-dev', 'js'], () => {
//     'use strict';
//     sync.init({
//         proxy: "domain.dev",
//         browser: "google chrome"
//     });
//     gulp.watch(config.ssDir + '/**/*.ss').on('change', sync.reload);
//     gulp.watch(config.scssDir + '/**/*.scss', ['style-dev']);
//     gulp.watch(config.jsDir + '/src/*.js', ['js-sync']);
// });



/*
 * Development mode, watching for changes
 * This mode creates non compressed CSS, non compressed JS
 * and creates sourcemaps.
*/
gulp.task('cd:watch', () => {
    'use strict';
    // Development task for compiling Sass
    watch(config.scssDir + '/**/*.scss', () => {
        gulp.start('cd:style-dev');
    });

    // Concatenating JS files, but not compressing
    watch(config.jsSrc + '/*.js', () => {
        gulp.start('cd:js');
    });
});


gulp.task("cd:sync", ['Auto-Publish-Views', 'Auto-Publish-Scripts', 'Auto-Publish-Css', 'Auto-Publish-Images', 'Auto-Publish-Fonts'], function () {
    gulp.start('cd:watch')
});