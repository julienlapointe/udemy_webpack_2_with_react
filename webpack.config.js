// tells Webpack what to do with our project
// Webpack runs in NodeJS (even if our project doesn't use NodeJS) so we can include / use NodeJS modules (ex. path)
var webpack = require('webpack');
// add "path" module
// generates the absolute path to where we want to output bundle.js (see below)
var path = require('path');

// cannot use ES2015 "export default" here... must use CommonJS because Webpack runs on NodeJS?
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	// loaders (now called "rules" in Webpack 2)
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
				// use: ["style-loader", "css-loader"],
				// ---
				// ^ this breaks some CSS conventions so we use the ExtractTextPlugin to save the CSS in a separate file 
				// Note: "use" (new) and "loader" (legacy) properties are the same
				// plugins and loaders are *not* the same... output from loaders must go into bundle.js, but plugins can withhold output from bundle.js (which we need in order to put our CSS into a separate file)
				loader: ExtractTextPlugin.extract({
					loader: 'css-loader'
				}),
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
	plugins: [
		// any CSS from .css files caught by css-loader in the rule above will get compiled and outputted into a single styles.css file
		new ExtractTextPlugin('styles.css')
	]
};