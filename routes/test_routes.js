let routes = require('express').Router();
let TestController = require('../controllers/test_controller');

routes.get('/test', TestController.test);

module.exports = routes;