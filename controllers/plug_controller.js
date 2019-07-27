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

                        let smartplugs = [];
                        response.data.map((smartplug) => {
                            smartplugs.push(smartplug);
                            logger.debug(smartplug.devices);

                            // Check if no plugs are attached to smartplug
                            if (smartplug.devices.length < 1) {
                                res.status(200).send(new ApiResponse("No plugs found", 200));
                            } else {
                                // TODO: Add support for multiple SmartPlugs
                                // 1 Smartplug > Multiple plugs
                                // res.status(200).send({
                                //     "smartPlugID": smartplug.id,
                                //     "smartPlugName": smartplug.name,
                                //     "smartPlugOnline": smartplug.online,
                                //     "devices": smartplug.devices
                                // });

                                res.status(200).send(smartplug.devices);
                            }
                        })
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