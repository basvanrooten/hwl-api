const logger = require('../config/config').logger
const config = require('../config/config');
var sha1 = require('sha1');
const axios = require('axios');

module.exports = {

    // Get Session Key from HomeWizard Lite
    getSessionKey() {

        // Get Username and Password from config file
        let username = config.hwlUsername;
        let password = sha1(config.hwlPassword);
        logger.debug(username);
        logger.debug(password);

        // Login to HWL using user credentials
        return axios({
                method: 'get',
                url: 'https://cloud.homewizard.com/account/login',
                auth: {
                    username: username,
                    password: password
                }
            })
            .then(response => {

                // Check status
                if (response.data.status === "ok") {

                    // Authentication passed, returning session token
                    logger.debug(response.data.session);
                    return response.data.session;

                } else if (response.data.status === "failed" && response.data.error === 110) {

                    // Authentication failed, returning FAILED
                    logger.error("HWL returned invalid credentials! Check credentials for validity!")
                    logger.debug(response.data);
                    return "ERROR";

                } else {

                    // Authentication failed, but with unknown reason
                    logger.error("HWL returned unknown authentication error. ERROR :", response.data);
                    return "ERROR";
                }
            })
            .catch(e => {
                // Cannot communicate with HWL, returning error
                logger.error("Failed to communicate with HWL! ERROR: ", e.message);
                return "ERROR";
            });
    }

}