const ApiResponse = require('../models/ApiResponse');
const AuthenticationManager = require('../auth/authentication_manager');
const logger = require('../config/config').logger
var LocalStorage = require('node-localstorage').LocalStorage;
const axios = require('axios');

localStorage = new LocalStorage('./states');

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
    },

    switchPlug(req, res, next) {

        AuthenticationManager.getSessionKey().then(sessionkey => {

            // Check if session key is valid
            if (sessionkey != "ERROR") {

                axios({
                        method: 'post',
                        url: 'https://plug.homewizard.com/plugs/' + req.params.smartPlugID + '/devices/' + req.params.plugID + '/action',
                        headers: {
                            "x-session-token": sessionkey
                        },
                        data: {
                            action: req.body.action.charAt(0).toUpperCase() + req.body.action.slice(1),
                        }
                    })
                    .then(response => {
                        logger.debug(response);

                        // Check if request was successful
                        // Should not be necessary, but still...

                        if (response.data.status === "Success") {
                            // Response successful


                            // Home Assistant compatibility for Restful switch, see 
                            // https://www.home-assistant.io/components/switch.rest/

                            // If action is ON: Return true

                            if (req.body.action.toUpperCase() === "ON") {

                                // Add plug state to local storage to remember state for Home Assistant
                                localStorage.setItem(req.params.plugID, true);
                                logger.debug("State for " + req.params.plugID + " saved to localStorage to true");

                                res.status(200).send({
                                    "is_active": "true"
                                });

                            } else {

                                localStorage.setItem(req.params.plugID, false);
                                logger.debug("State for " + req.params.plugID + " saved to localStorage to false");

                                res.status(200).send({
                                    "is_active": "false"
                                });
                            }

                        } else {
                            // Unsuccessful
                            res.status(400).send(new ApiResponse(e.message, 400));
                        }
                    })
                    .catch(e => {
                        // Cannot communicate with HWL, returning error
                        logger.error("HWL declined the request. ERROR: ", e.message);
                        res.status(400).send(new ApiResponse("HWL declined the request. ERROR: " + e.message, 400));
                    });
            } else {
                // Session key is invalid
                res.status(503).send(new ApiResponse("Invalid session key! Check the logs for more details about this problem ", 503));
            }
        });
    },

    plugState(req, res, next) {

        // Check if state exists
        if (!localStorage.getItem(req.params.plugID)) {
            logger.debug("Item doesn't exist");
            
            // Return false if plug doesn't have a recorded state
            res.status(200).send({
                "is_active": "false"
            });
            
        } else {
            logger.debug("Item exists");

            // Return state from localStorage
            res.status(200).send({
                "is_active": localStorage.getItem(req.params.plugID)
            });
        }
    }
}