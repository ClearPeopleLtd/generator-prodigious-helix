"use strict";

var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    order = require("gulp-order"),
    gulp = require("gulp");
var debug = require("gulp-debug");


var MinifyJs = function(src, orderSrc, name) {
	console.log("Compiling " + name);
	return gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(order(orderSrc))
		.pipe(concat(name))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(global.settings.Paths.RelativeProjectFolder + '/scripts', { overwrite: true }));
}

gulp.task('minify-js:standard:custom', function () {
	return MinifyJs(
        global.settings.Paths.MinifyScriptsCustomSrc,
        global.settings.Paths.Standard.MinifyScriptsCustomOrder,
        global.settings.Paths.Standard.MinifyScriptCustomName);
});

gulp.task('minify-js:standard:vendor', function () {
	console.log(global.settings.Paths.MinifyScriptsVendorSrc);
	return MinifyJs(
        global.settings.Paths.MinifyScriptsVendorSrc,
        global.settings.Paths.Standard.MinifyScriptsVendorOrder,
        global.settings.Paths.Standard.MinifyScriptVendorName);
});

gulp.task('minify-js', ['minify-js:standard:custom', 'minify-js:standard:vendor'], function () {
});

