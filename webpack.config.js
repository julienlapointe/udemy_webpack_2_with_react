// NOTE: if you change webpack.config.js file, then you must re-start the webpack-dev-server (it doesn't watch for changes in this file...)

// tells Webpack what to do with our project
// Webpack runs in NodeJS (even if our project doesn't use NodeJS) so we can include / use NodeJS modules (ex. path)
var webpack = require('webpack');
// add "path" module
// generates the absolute path to where we want to output bundle.js (see below)
var path = require('path');
// generates the <script> tags for all .js files outputted by Webpack and adds them into the index_template.html file
var HtmlWebpackPlugin = require('html-webpack-plugin');

// array of strings
// each string is a vendor library
const VENDOR_LIBS = [
	"faker",
    "lodash",
    "react",
    "react-dom",
    "react-input-range",
    "react-redux",
    "react-router",
    "redux",
    "redux-form",
    "redux-thunk"
];

// cannot use ES2015 "export default" here... must use CommonJS because Webpack runs on NodeJS?
module.exports = {
	// single point of entry
	// entry: './src/index.js',
	// create multiple entry points for app
	// this allows us to create separate bundles for our source code (changes frequently) vs. vendor source code (changes infrequently so clients can cache on their local computers to speed up load time)
	entry: {
		// create a file called bundle.js (because the key is "bundle") from the entry point of index.js
		bundle: './src/index.js',
		// create a separate file called vendor.js that contains all our external dependencies listed in package.json
		// VENDOR_LIBS needs to stay in sync w/ package.json (same dependencies in same order?)
		vendor: VENDOR_LIBS
	},
	output: {
		path: path.join(__dirname, 'dist'),
		// filename: 'bundle.js'
		// [name] gets replaced by key from "entry" property (ex. bundle.js and vendor.js)
		// [chunkhash] is a unique identifier generated from the file's content
		// if file changes, then [chunkhash] changes
		// this tells users' browsers to download new bundles (if Webpack always outputted a file named "bundle.js", then returning visitors' browsers wouldn't download the file because they already have a file named "bundle.js" in cache)
		filename: '[name].[chunkhash].js'
	},
	// loaders (now called "rules" in Webpack 2)
	// modules work on individual files (as opposed to plugins, which work on the total input / output of Webpack)
	module: {
		rules: [
			{
				use: "babel-loader",
				// regular expression that Webpack applies to every file in our project
				// Babel gets transpiles files that match the regular expression
				// /\.js$/ = file has a ".js" extension
				test: /\.js$/,
				// modules from NPM are already transpiled to ES2009/ ES5
				exclude: /node_modules/
			},
			{
				// loaders are applied from <-- RIGHT TO LEFT <--
				// order is important: css-loader must be on right / must load first
				// css-loader opens / reads the CSS files
				// style-loader puts the CSS styles in a <style> tag inside the <head> tag at the top of HTML documents... 
				use: ["style-loader", "css-loader"],
				// ---
				// ^ this breaks some CSS conventions so we use the ExtractTextPlugin to save the CSS in a separate file 
				// Note: "use" (new) and "loader" (legacy) properties are the same
				// plugins and loaders are *not* the same... output from loaders must go into bundle.js, but plugins can withhold output from bundle.js (which we need in order to put our CSS into a separate file)
				// loader: ExtractTextPlugin.extract({
					// loader: 'css-loader'
				// }),
				// any files with .css extension will be sent to these loaders (listed in the line below) for pre-processing
				test: /\.css$/
			},
			{
				use: [
					{
						loader: "url-loader",
						// images smaller than 40,000 bytes (40kb) get saved inline in bundle.js, whereas larger images get saved in a separate file
						options: { limit: 40000 }
					},
					"image-webpack-loader"
				],
				test: /\.(jpe?g|png|gif|svg)$/
			}

		]
	},
	// plugins work on the total input / output of Webpack
	plugins: [
		// any CSS from .css files caught by css-loader in the rule above will get compiled and outputted into a single styles.css file
		// new ExtractTextPlugin('styles.css')

		// prevents Webpack from including modules / libraries (ex. React, Redux, etc.) in both bundle.js and vendor.js
		new webpack.optimize.CommonsChunkPlugin({
			// if there are any duplicate modules / libraries between bundle.js and vendor.js, delete them from bundle.js and only keep them in vendor.js ("vendor" value below)
			// users / clients will keep vendor.js cached on their local computer
			// manifest.js file tells the user's browser whether vendor.js has changed / whether the user's browser should download the vendor.js file
			names: ["vendor", "manifest"]
		}),
		// generates the <script> tags for all .js files outputted by Webpack and adds them into the index_template.html file
		new HtmlWebpackPlugin({
			template: "src/index_template.html"
		}),
		// React looks for window.NODE_ENV when it boots up on user's browser
		// if NODE_ENV is set to "production", then React performs less error checking to increase performance
		// DefinePlugin defines the window-scoped variable "process.env.NODE_ENV"
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		})
	]
};