// express server
const express = require("express");


// object of express server
const app = express();

// add routes here...
// app.get("/hello", (req, res) => res.send({hi: "there"}));

// if in "dev" environment (not in "prod" environment), then...
// note for deployment: need to Google how to set process.env.NODE_ENV value (varies from host to host)
if (process.env.NODE_ENV !== "production") {
	// intercepts incoming requests and hands them off to Webpack
	const expressWebpackMiddleware = require("webpack-dev-middleware");
	// bundles our project
	const webpack = require("webpack");
	// tells Webpack how to bundle our project
	const webpackConfig = require("./webpack.config.js");
	// tell express app to use the middleware to tell Webpack to "build" when an HTTP request is received
	app.use(expressWebpackMiddleware(webpack(webpackConfig)));
// otherwise, we are in "prod" environment...
} else {
	// add "path" module
	const path = require("path");
	// respond to HTTP requests from users with the assets from "dist" directory
	// tells Express to make all files inside "dist" folder available to user (similar to a "public_html" folder?)
	app.use(express.static("dist"));
	// if user makes an HTTP request to ANY (*) route on our server, then respond with the index.html file
	// ensures that React Router browser history works correctly
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "dist/index.html"));
	});
}


// listens for incoming HTTP requests from user
// app.listen(3050, () => console.log("Listening..."))
// if host specifies PORT in "prod" environment, then use their PORT... otherwise use 3050 ("dev" environment)
app.listen(process.env.PORT || 3050, () => console.log("Listening..."))

// Note re: deploying to Heroku
// create a Procfile in root folder
// Procfile is automatically executed by Heroku 
// Procfile tells Heroku what command to run when we want to start our server
// web: node server.js
// "web" indicates that this is a "web server"