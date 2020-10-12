// Set debug level for tracer
const loglevel = process.env.LOGLEVEL || "warn";

module.exports = {
    // Web port where the server will listen to
    webPort: process.env.PORT || 3000,

    // Authentication for Homewizard Lite API
    hwlUsername: process.env.HWL_USERNAME || "",
    hwlPassword: process.env.HWL_PASSWORD || "",

    // SmartPlugID
    // Should be returned from HW when you GET on /api/smartplug
    smartPlugId:
        process.env.SMARTPLUG_ID || "",

    // Dimmer Ranges
    // Some dimmers only support dimming up to a certain amount.
    minDimmingValue: process.env.MIN_DIMMING_VALUE || 1,

    // Cache Time To Live
    cacheTTL: process.env.CACHE_TTL || 1800,

    // Tracer for logging purposes
    logger: require("tracer").console({
        format: ["{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}"],
        preprocess: function (data) {
            data.title = data.title.toUpperCase();
        },
        dateformat: "isoUtcDateTime",
        level: loglevel,
    }),
};