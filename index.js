const app = require('./app');
const config = require('./config/config');

// Ensures the app starts and uses port 3000 or environment port
app.listen(config.webPort, () =>  {
    console.info('App running on port ' + config.webPort);
});