var projectName = "<%= solutionName %>";
var rootFolder = "C:\\" + projectName;
var projectFolder = rootFolder + "\\src\\Project\\" + projectName + "\\code";
var relativeProjectFolder = "src/Project/" + projectName + "/code";
var deployRootFolder = rootFolder + "\\temp"; //folder out of Git folder, so we don't want to track these compiled files
var themeFolder = "src/Foundation/Theming/code";

module.exports = function () {
	var instanceRoot = "C:\\inetpub\\wwwroot\\<%= solutionName.toLowerCase() %>.dev.local";
	var config = {
		websiteRoot: instanceRoot + "\\Website",
		sitecoreLibraries: instanceRoot + "\\Website\\bin",
		licensePath: instanceRoot + "\\Data\\license.xml",
		solutionName: "<%= solutionName %>",
		mainProjectName: projectName,
		buildConfiguration: "Debug",
		runCleanBuilds: false,


		Paths: {
			RelativeProjectFolder: relativeProjectFolder,
			RootFolder: rootFolder,
			ProjectFolder: projectFolder,
			DeployRootFolder: deployRootFolder,
			SolrCoresPath: "C:\\Workspace\\solr-6.4.1-0\\apache-solr\\server\\solr",

			AllJsScripts: [relativeProjectFolder + "/**/assets/**/*.js"],
			MinifyScriptsCustomSrc: relativeProjectFolder + "/assets/scripts/*.js",
			MinifyScriptsVendorSrc: [
                //relativeProjectFolder + "/assets/js/min/jquery-1.11.2.min.js",
			],
			MinifyScriptsCacheSrc: "/assets/scripts/cache/*.js", 
			MinifyCssSrc: relativeProjectFolder + "/assets/style/" + projectName + ".scss",
			MinifyCssVendorSrc: [
				relativeProjectFolder + "/assets/style/vendor/**/*.css"
			],

			Standard: {
				Path: "./Standard",
				DeployRootFolder: deployRootFolder + '/standard',
				DeployAssetsFolder: deployRootFolder + "/standard/Assets",
				MinifyScriptsVendorOrder: [
					"**/modernizr.js",
					"**/jquery-1.11.2.min.js",
                    "*.js"
				],
				MinifyScriptsCustomOrder: [
                    "*.js"
				],
				MinifyCSSOrder: [
                    "*.css"
				],
				MinifySCSSOrder: [
                    "*.scss"
				],

				MinifyScriptCustomName: projectName + '.min.js',
				MinifyScriptVendorName: projectName + '.vendor.min.js',
				MinifyCssName: projectName + '.min.css',
				MinifyCssVendorName: projectName + '.vendor.min.css'
			}
		}
	};
	return config;
}