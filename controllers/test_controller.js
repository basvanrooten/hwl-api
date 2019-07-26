const ApiResponse = require('../models/ApiResponse');
var logger = require('tracer').colorConsole();
const axios = require('axios');


module.exports = {

    responseTest(req, res, next) {

       res.status(200).send(new ApiResponse("Acknowledged", 200));
       logger.debug("Returned test message");
    },

    communicationTest(req, res, next) {
        axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(result => {
                logger.debug(result.data);
                res.status(200).send(result.data);
            }).catch(e => {
                logger.error("Can't connect to NASA API, possible internet outtage? ERROR: ", e.message);
                res.status(503).send(new ApiResponse(e.message, 503));
            })
    }
}