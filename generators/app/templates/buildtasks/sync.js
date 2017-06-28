"use strict";

var gulp = require("gulp"),
    util = require('gulp-util');
//spsave = require('gulp-spsave'),

var foreach = require("gulp-foreach");
var newer = require("gulp-newer");
var debug = require("gulp-debug");
var size = require("gulp-size");

gulp.task("Auto-Publish-Compiled-Assets", function () {
    var root = global.settings.Paths.ProjectFolder;
    console.log(root);
    var roots = [root + "/assets/final"];
    var files = "/*.*";
    var destination = global.settings.websiteRoot + "\\assets\\final";
    gulp.src(roots, { base: root }).pipe(
    foreach(function (stream, rootFolder) {
        console.log(rootFolder.path + files);
        gulp.watch(rootFolder.path + files, function (event) {
            console.log(event.type);
            if (event.type === "changed") {
                console.log("publish this file " + event.path);
                gulp.src(event.path, { base: rootFolder.path }).pipe(gulp.dest(destination));
                console.log("published " + event.path);
            }
        });
        return stream;
    })
    ).pipe(size());
});

gulp.task("sync", ['Auto-Publish-Views', 'Auto-Publish-Scripts', 'Auto-Publish-Css', 'minify-css:features', 'Auto-Publish-Services', 'minify-js', 'minify-css'], function () {
    /* Start Cyberduck watch tasks */
    //gulp.start('cd:watch');

    var watcherJs = gulp.watch(
        [global.settings.Paths.ProjectFolder + "/assets/scripts/**/*.js"],
        ['minify-js']);


    var watcherCss = gulp.watch(
        [global.settings.Paths.ProjectFolder + "/assets/style/**/*.scss"],
        ['minify-css']);
});