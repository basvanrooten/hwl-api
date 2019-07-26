let routes = require('express').Router();
const PlugController = require('../controllers/plug_controller');

// Routes here
routes.get('/plug', PlugController.getAllPlugs);

module.exports = routes;