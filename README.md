# Home Wizard Lite RESTFUL Proxy API (Node.JS)
HomeWizard Lite Proxy API, built for integrating cheap HomeWizard Lite smartplugs into [Home Assistant](https://www.home-assistant.io/) for example, freeing the user from the dreadful HWL Android or iOS app.

## Installation

    $ git clone https://github.com/basvanrooten/hwl-api
    $ npm install
    $ npm start
    $ node index.js

The API depends on environment variables for authentication with HomeWizard API.

| Key | Value |
|--|--|
| HWL_USERNAME | HomeWizard Lite App Username |
| HWL_PASSWORD | HomeWizard Lite App Password |
| LOGLEVEL | [Tracer Logger Level](https://github.com/baryon/tracer#customize-output-format)  (default trace) |

## Deploying
The API should be deployed on a local network, because it has no built-in authentication. It is always possible to protect the API with HTTP Basic Auth and make it accessible over the internet, but take note of the insecurities of HTTP Basic Auth.

The API could also be deployed in a docker container

## Requests
|Method | URL | Description |
| -- | -- | -- |
| GET | /api/test/session | Returns valid session key (Only necessary for testing)* |
| GET | /api/test/communication | Returns status 200 when API can connect to Google Test API to verify internet connectivity |
| -- | -- | -- |
| GET | /api/plug | Returns all registered plugs |
| GET | /api/act/smartplug/:smartPlugID/plug/:plugID | Returns `true` or `false` for is_active state of a plug specified by plugID |
| POST | /api/act/smartplug/:smartPlugID/plug/:plugID | Switches plug when request body contains `"action": "on"` or `"action": "off"`. Returns is_active state.

## Contribution
This project was started by an IT-student as a small 2 day project to improve home-automation by enabling Home Assistant to control HomeWizard Lite plugs. Development will continue when I need more features. Contribution is appreciated.
