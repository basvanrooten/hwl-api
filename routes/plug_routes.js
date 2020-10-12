let routes = require("express").Router();
const PlugController = require("../controllers/plug_controller");

// Plug routes
// Check documentation for possible calls
routes.get("/plug", PlugController.getAllPlugs);
routes.get("/smartplug", PlugController.getSmartPlug);
routes.post("/plug/:plugID", PlugController.switchPlug);
routes.get("/plug/:plugID", PlugController.plugState);

module.exports = routes;
