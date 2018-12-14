// Node dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const config = require('./config/config');
const logger = require('./config/config').logger

// Import models
const ApiResponse = require('./models/ApiResponse');

// Routes
console.log("No routes defined");

const app = express();

// Parse the request body to JSON
app.use(bodyParser.json());

// Setup Morgan as Logger
app.use(morgan("dev"));

// Enable CORS-support
app.use(cors());

app.get('/', function(req, res, next) {
    res.status(200).send(new ApiResponse("Hello World!", 202));
});

//This endpoint is called when no other one was found, and throws a 404 error
app.use('*', function(req, res, next){
    res.status(404).send(new ApiResponse("This endpoint doesnt't exist", 404));
});

module.exports = app;