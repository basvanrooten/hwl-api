const logger = require("../config/config").logger;
const config = require("../config/config");
var sha1 = require("sha1");
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: config.cacheTTL });

module.exports = {
    // Get Session Key from HomeWizard Lite
    getSessionKey() {
        // Check if sessionkey is cached
        let sessionKey = cache.get("session");

        if (sessionKey) {
            logger.debug(`Cached session key found: ${sessionKey}`);
            return Promise.resolve(sessionKey);
        } else {
            // Session key is not found in cache
            let username = config.hwlUsername;
            let password = sha1(config.hwlPassword);
            logger.debug(username);
            logger.debug(password);

            return axios({
                method: "get",
                url: "https://cloud.homewizard.com/account/login",
                auth: {
                    username: username,
                    password: password,
                },
            })
                .then((response) => {
                    logger.debug(
                        `Received session key: ${response.data.session}`
                    );
                    cache.set("session", response.data.session);
                    return response.data.session;
                })
                .catch((e) => {
                    // Exception occured while trying to communicate with HWL.
                    logger.error("Can't get session key from HW");
                    logger.error(e.response);
                    return Promise.reject("Can't get session key from HW. Check logs");
                });
        }
    },
};
