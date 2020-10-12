let routes = require('express').Router();
let TestController = require('../controllers/test_controller');

// Test Routes
routes.get('/test/communication', TestController.communicationTest);
routes.get('/test/session', TestController.getSessionKey);

module.exports = routes;