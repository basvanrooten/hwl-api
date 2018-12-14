const app = require('./app');
const config = require('./config/config');

let port = config.webPort;

//Ensures the app starts and uses port 3000 or environment port
app.listen(port, () =>  {
    console.info('App running on port ' + port)
});