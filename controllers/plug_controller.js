const ApiResponse = require('../models/ApiResponse');
const AuthenticationManager = require('../auth/authentication_manager');
const logger = require('../config/config').logger
var LocalStorage = require('node-localstorage').LocalStorage;
const axios = require('axios');
const config = require("../config/config");

localStorage = new LocalStorage('./states');

module.exports = {
    // Return all registered plugs
    getAllPlugs(req, res, next) {
        const sessionKey = AuthenticationManager.getSessionKey().then(sessionkey => {

            // Check if session key is valid
            if (sessionkey) {
                axios({
                        method: 'get',
                        url: 'https://plug.homewizard.com/plugs',
                        headers: {
                            "x-session-token": sessionkey
                        }
                    })
                    .then(response => {
                        let resArray = [];
                        response.data.map((smartplug) => {
                            resArray.push({
                                id: smartplug.id,
                                identifier: smartplug.identifier,
                                name: smartplug.name,
                                latitude: smartplug.latitude,
                                longitude: smartplug.longitude,
                                online: smartplug.online,
                                devices: smartplug.devices,
                            });
                        });
                        res.status(200).send(resArray);
                    })
                    .catch(e => {
                        // Cannot communicate with HWL, returning error
                        logger.error("Failed to communicate with HWL! ERROR: ", e.message);
                        res.status(503).send(new ApiResponse(e.message, 503));
                    });
            } else {
                // Session key is invalid
                res.status(503).send(new ApiResponse("Invalid session key! Check logs", 503));
            }
        }).catch(e => {
            res.status(503).send(new ApiResponse(e, 503));
        });
    },

    // Change the state of a plug
    switchPlug(req, res, next) {
        AuthenticationManager.getSessionKey().then(sessionkey => {

            // Check if session key is valid
            if (sessionkey) {

                let data = undefined;

                // Check plug type
                if(req.body.type && req.body.type.toLowerCase() === "dimmer") {

                    const dimmerLevel = req.body.value;
                    if(typeof(dimmerLevel) === "number") {
                        if(dimmerLevel < config.minDimmingValue) {
                            data = {
                                action: "Off",
                            }
                        } else if (dimmerLevel <= 100){
                            data = {
                                action: "Range",
                                value: dimmerLevel
                            }
                        } else {
                            // Dimming level is at an invalid amount
                            logger.error(`Dimmer Level can't be above 100, found ${dimmerLevel}`);
                            res.status(400).send(new ApiResponse(`Dimmer Level can't be above 100, found ${dimmerLevel}`));
                        }
                    } else {
                        res.status(400).send(new ApiResponse("Invalid value. For dimmers you should provide an integer between 0 and 100", 400));
                    }

                } elseif(req.body.type && req.body.type.toLowerCase() === "brel_ud_curtain") {
                    // Device is a curtain, identified as "brel_ud_curtain"
                    // Variable to store wanted Action 
                    let actionValue;
                    
                    if (req.body.value.toLowerCase() === "up") {
                        actionValue = "Up";
                    } elseif(req.body.value.toLowerCase() === "stop"){
                        actionValue = "Stop";
                    } elseif(req.body.value.toLowerCase() === "down"){
                        actionValue = "Down";
                    } else {
                        res.status(400).send(new ApiResponse("Invalid value. For curtain typ brel_ud_curtain you should provide 'Up', 'Down' or 'Stop'", 400));
                    }

                    // create data object with selected Action 
                    data = {
                        action: actionValue,
                    };
                
                } else {
                    // Plug is not a dimmer or curtain, so should be a switch
                    if (req.body.value && typeof(req.body.value) === "string") {
                        data = {
                            action: req.body.value.toLowerCase() === "on" ? "On" : "Off",
                        }
                    } else {
                        res.status(400).send(new ApiResponse("Invalid value. For switches you should provide 'On' or 'Off'", 400));
                    }
                }

                if(data) {
                    axios({
                        method: "post",
                        url:
                            "https://plug.homewizard.com/plugs/" +
                            config.smartPlugId +
                            "/devices/" +
                            req.params.plugID +
                            "/action",
                        headers: {
                            "x-session-token": sessionkey,
                        },
                        data: data,
                    })
                        .then((response) => {
                            logger.debug(response);

                            // Check if request was successful
                            // Should not be necessary, but still...

                            if (response.data.status === "Success") {
                                // Response successful

                                // Home Assistant compatibility for Restful switch, see
                                // https://www.home-assistant.io/components/switch.rest/

                                if(typeof(req.body.value) === "number") {
                                    const plugState = req.body.value >= config.minDimmingValue;
                                    localStorage.setItem(req.params.plugID, plugState);
                                    res.status(200).send({ is_active: plugState });
                                } else {
                                    const plugState = req.body.value.toLowerCase() === "on";
                                    localStorage.setItem(req.params.plugID, plugState);
                                    res.status(200).send({ is_active: plugState });
                                }
                            } else {
                                // Unsuccessful
                                res.status(503).send(new ApiResponse(`HWL returned an error. Check logs`, 503));
                            }
                        })
                        .catch((e) => {
                            // Cannot communicate with HWL, returning error
                            logger.error(`Can't communicate with HWL: ${e}`);
                            res.status(400).send(new ApiResponse(`Can't communicate with HWL. Check logs`, 503));
                        });
                }
            } else {
                // Session key is invalid
                res.status(503).send(new ApiResponse("Invalid session key! Check the logs for more details about this problem ", 503));
            }
        }).catch(e => {
            logger.error(e);
            res.status(503).send(new ApiResponse(e, 503));
        });
    },

    // Get state of plug
    plugState(req, res, next) {
        // Check if state exists
        if (!localStorage.getItem(req.params.plugID)) {
            logger.debug("Item doesn't exist");

            // Return false if plug doesn't have a recorded state
            res.status(200).send({
                "is_active": false
            });
        } else {
            logger.debug("Item exists");
            // Return state from localStorage
            res.status(200).send({
                "is_active": localStorage.getItem(req.params.plugID) === "true"
            });
        }
    },

    // Get information about Smartplug
    getSmartPlug(req, res, next) {
        AuthenticationManager.getSessionKey().then(sessionkey => {

            // Check if session key is valid
            if (sessionkey) {
                axios({
                        method: 'get',
                        url: 'https://plug.homewizard.com/plugs',
                        headers: {
                            "x-session-token": sessionkey
                        }
                    })
                    .then(response => {
                        response.data.map((smartplug) => {

                            // Check if no smartplugs exist
                            if (smartplug.length == 0) {
                                res.status(200).send(new ApiResponse("No smartplugs found", 200));
                            } else {

                                // Create custom response based on response data
                                res.status(200).send({
                                    "id": smartplug.id,
                                    "name": smartplug.name,
                                    "online": smartplug.online,
                                    "latitude": smartplug.latitude,
                                    "longtitude": smartplug.longtitude,
                                    "timeZone": smartplug.timeZone,
                                    "firmwareUpdateAvailable": smartplug.firmwareUpdateAvailable
                                });
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
        }).catch(e => {
            logger.error(e);
            res.status(503).send(new ApiResponse(e, 503));
        });
    }
}
