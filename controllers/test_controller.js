const ApiResponse = require('../models/ApiResponse');
var logger = require('tracer').colorConsole();
const axios = require('axios');


module.exports = {

    responseTest(req, res, next) {

       res.status(200).send(new ApiResponse("Acknowledged", 200));
       logger.debug("Returned test message");
    },

    communicationTest(req, res, next) {
        axios.get('https://clients3.google.com/generate_204')
            .then(result => {
                logger.debug(result);
                res.status(200).send(new ApiResponse("Successfully connected to internet", 200));
            }).catch(e => {
                logger.error("Can't connect to Google Test API, possible internet outtage? ERROR: ", e.message);
                res.status(503).send(new ApiResponse(e.message, 503));
            })
    }
}