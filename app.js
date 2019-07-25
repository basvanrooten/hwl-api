// Node dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const config = require('./config/config');
const logger = require('./config/config').logger

// Import models
const ApiResponse = require('./models/ApiResponse');

// Import routes
const test_routes = require('./routes/test_routes');
// const plug_routes = require('./routes/plug_routes');

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

app.use('/api', test_routes);



//This endpoint is called when no other one was found, and throws a 404 error
app.use('*', function(req, res, next){
    res.status(404).send(new ApiResponse("This endpoint doesnt't exist", 404));
});

module.exports = app;