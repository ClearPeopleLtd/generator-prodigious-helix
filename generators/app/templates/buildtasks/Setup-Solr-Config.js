"use strict";

var gulp = require("gulp");
var exec = require("child_process").exec;
var runSequence = require("run-sequence");


var solrCleanCores = global.settings.Paths.RootFolder + "\\installation\\Sitecore_Solr_Cores.zip";
var solrCoresPath = global.settings.Paths.SolrCoresPath;

gulp.task("Setup_Solr", function (callback) {
	return runSequence(
      "_Setup-Solr-Config",
      "_Install-Solr-Cores",
      callback);
});

gulp.task("_Setup-Solr-Config", function (callback) {
	exec("Powershell.exe -executionpolicy remotesigned . .\\buildtasks\\setup-solr.ps1; Set-SCSearchProvider -rootPath '" + global.settings.websiteRoot + "'",
	    function (err, stdout, stderr) {
	    	console.log(stdout);
	    	callback(err);
	    });
});

gulp.task("_Install-Solr-Cores", function (callback) {
	exec("Powershell.exe -executionpolicy remotesigned . .\\buildtasks\\install-solr-cores.ps1; " +
		"Set-SolrCores -solrCleanCores '" + solrCleanCores + "' " +
					   "-solrCoresPath '" + solrCoresPath + "' ",
	    function (err, stdout, stderr) {
	    	console.log(stdout);
	    	callback(err);
	    });
});