const ApiResponse = require('../models/ApiResponse');
var logger = require('tracer').colorConsole();


module.exports = {

    test(req, res, next) {

       res.status(200).send(new ApiResponse("Acknowledged", 200));
       logger.debug("Returned test message");
    }
}