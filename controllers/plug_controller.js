const ApiResponse = require('../models/ApiResponse');
const AuthenticationManager = require('../auth/authentication_manager');
const logger = require('../config/config').logger
const axios = require('axios');


module.exports = {

    login(req, res, next) {
        // TODO: Implement Login
        
    },
    getAllPlugs(req, res, next) {
        // Return all registered smart plugs

        AuthenticationManager.getSessionKey().then(sessionkey => {

            // Check if session key is valid
            if (sessionkey != "ERROR") {
                axios({
                    method: 'get',
                    url: 'https://plug.homewizard.com/plugs',
                    headers: {
                        "x-session-token": sessionkey
                    }
                })
                .then(response => {
                    logger.debug(response.data);
                    res.status(200).send(response.data);

                    // TODO: FILTER RESPONSE DATA TO INCLUDE PLUGS ONLY
                })
                .catch(e => {
                    // Cannot communicate with HWL, returning error
                    logger.error("Failed to communicate with HWL! ERROR: ", e.message);
                    res.status(503).send(new ApiResponse(e.message, 503));
                });
            } else {
                // Session key is invalid
                res.status(503).send(new ApiResponse("Invalid session key! Check the logs for more details about this problem ", 503));
            }

        });
    }
}