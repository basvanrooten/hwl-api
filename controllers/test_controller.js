const ApiResponse = require('../models/ApiResponse');
const AuthenticationManager = require('../auth/authentication_manager');
const logger = require('../config/config').logger
const axios = require('axios');


module.exports = {

    communicationTest(req, res, next) {
        axios.get("https://www.google.com")
            .then(() => {
                res.status(200).send(new ApiResponse("Successfully connected to the internet", 200));
            }).catch(e => {
                logger.error("Can't connect to Google, possible internet outtage? Check log", e.message);
                res.status(503).send(new ApiResponse("Can't connect to Google, possible internet outtage?", 503));
            });
    },

    getSessionKey(req, res, next) {
        AuthenticationManager.getSessionKey().then(sessionkey => {
            res.status(200).send({
                "session": sessionkey
            });
        }).catch(e => {
            res.status(503).send(new ApiResponse(e, 503));
        });
    }
}