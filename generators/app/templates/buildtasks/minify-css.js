"use strict";

var gulp = require("gulp"),
    order = require("gulp-order"),
    Filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');
var foreach = require("gulp-foreach");
var size = require("gulp-size");
var debug = require("gulp-debug");
var path = require('path');

var SASS_INCLUDE_PATHS = [
  global.settings.Paths.RelativeProjectFolder,
  "src/Foundation/Theming/code"
];

var MinifyCss = function (src, dest, name) {
    var filter = Filter('**/*.scss', { restore: true });
    var filterCss = Filter('**/*.css', { restore: true });
    console.log("Compiling " + name);
	console.log(src);
	console.log(dest);
    return gulp.src(src)
        .pipe(filterCss)
        .pipe(order(global.settings.Paths.Standard.MinifyCSSOrder))
        .pipe(filterCss.restore)
        .pipe(filter)
        .pipe(order(global.settings.Paths.Standard.MinifySCSSOrder))
        .pipe(sass({
        	includePaths: SASS_INCLUDE_PATHS,
        	outputStyle: 'expanded'
        })).on('error', sass.logError)
        .pipe(filter.restore)
        .pipe(concat(name))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false, remove: false }))
        .pipe(uglifycss())
        .pipe(gulp.dest(dest, { overwrite: true }));
};

gulp.task('minify-css:standard', function () {
    return MinifyCss(
        global.settings.Paths.MinifyCssSrc,
        global.settings.Paths.RelativeProjectFolder + '/styles',
        global.settings.Paths.Standard.MinifyCssName);
});

gulp.task('minify-css:vendor', function () {
	return MinifyCss(
        global.settings.Paths.MinifyCssVendorSrc,
        global.settings.Paths.RelativeProjectFolder + '/styles',
        global.settings.Paths.Standard.MinifyCssVendorName);
});


gulp.task("minify-css:features", function () {
    var root = "./src";
    var roots = [root + "/Feature/**/styles", "!" + root + "/**/obj/**/styles", "!" + root + "/**/bin/**/styles"];
    var files = "/**/*.scss";
    debugger;
    gulp.src(roots, { base: root }).pipe(
    foreach(function (stream, rootFolder) {
        gulp.watch(rootFolder.path + files, function (event) {
            if (event.type === "changed") {
                var src = path.dirname(event.path);
                var destination = src;
                var name = path.basename(event.path, '.scss');
                gulp.src(event.path, { base: src }).pipe(gulp.dest(destination));
                console.log("publishing " + event.path);
                return MinifyCss(
                    src + "/*.scss",
                    destination,
                    name + ".min.css");
            }
        });
        return stream;
    })
    ).pipe(size());
});

gulp.task('minify-css', ['minify-css:standard', 'minify-css:vendor'],
    function () {
    }
);