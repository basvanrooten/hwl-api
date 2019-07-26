let routes = require('express').Router();
let TestController = require('../controllers/test_controller');

// Test Routes
routes.get('/test', TestController.responseTest);
routes.get('/test/communication', TestController.communicationTest);

module.exports = routes;