// express server
const express = require("express");
// intercepts incoming requests and hands them off to Webpack
const expressWebpackMiddleware = require("webpack-dev-middleware");
// bundles our project
const webpack = require("webpack");
// tells Webpack how to bundle our project
const webpackConfig = require("./webpack.config.js");

// object of express server
const app = express();

// tell express app to use the middleware to tell Webpack to "build" when an HTTP request is received
app.use(expressWebpackMiddleware(webpack(webpackConfig)));

// listens for incoming HTTP requests from user
app.listen(3050, () => console.log("Listening..."))