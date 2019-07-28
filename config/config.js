// Set debug level for tracer
const loglevel = process.env.LOGLEVEL || 'trace'

module.exports = {

    // Web port where the server will listen to
    "webPort": process.env.PORT || 3000,
    "authKey": process.env.AUTHKEY || "",

    // Authentication for Homewizard Lite API
    "hwlUsername": process.env.HWL_USERNAME || "",
    "hwlPassword": process.env.HWL_PASSWORD || "",


    // Tracer for logging purposes
    logger: require('tracer')
    .console({
        format: [
            "{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}"
        ],
        preprocess: function (data) {
            data.title = data.title.toUpperCase();
        },
        dateformat: "isoUtcDateTime",
        level: loglevel
    })

}