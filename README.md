# Home Wizard Lite RESTFUL Proxy API (Node.JS)
HomeWizard Lite Proxy API, built for integrating cheap HomeWizard Lite smartplugs into [Home Assistant](https://www.home-assistant.io/) for example, freeing the user from the dreadful HWL Android or iOS app.

## Installation

    $ git clone https://github.com/basvanrooten/hwl-api
    $ npm install
    $ npm start
    $ node index.js

The API depends on environment variables. **Make sure to configure the bold variables, as these have no default**.

| Key | Type | Value |
|--|--|--|
| PORT | number |  Port on which the API will listen (default: 3000) |
| | | |
| **HWL_USERNAME** | string |  HomeWizard Lite App Username |
| **HWL_PASSWORD** | string | HomeWizard Lite App Password |
| | | |
| **SMARTPLUG_ID** | string | ID of the Internet Connected Smartplug. GET this ID from /api/smartplug |
| MIN_DIMMING_VALUE | number | The API supports dimmers. Some dimmers have a certain minimum threshold. When you request the API to go below the minimum dimming value, it'll instead turn off the light. (default: 1) |
| | | |
| CACHE_TTL | number | Default expiration time for cache objects in seconds. Currently only in use for caching session-tokens from HWL. (default: 1800)
| LOGLEVEL | string | [Tracer Logger Level](https://github.com/baryon/tracer#customize-output-format)  (default: warn) |
| | | |

## Deploying
* The API should be deployed on a local network and shouldn't be accessible over the interwebs, because it currently has no built-in authentication. It is always possible to configure [HTTP Basic Authentication](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/).
* The API should have access to homewizard.com and its subdomains.

Using the included Dockerfile, it is also possible to run this API inside a container.

## Endpoints
| Method | URL                     | Description                                                                                                                                                                                        | Example Request                                  | Example Response          |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------- |
| GET    | /api/test/session       | Returns valid session key (Only necessary for testing)                                                                                                                                             |                                                  | `{ "session": "string"` } |
| GET    | /api/test/communication | Returns status 200 when API can connect to Google  to verify internet connectivity                                                                                                                 |                                                  |                           |
|        |                         |                                                                                                                                                                                                    |                                                  |                           |
| GET    | /api/plug               | Returns all registered plugs                                                                                                                                                                       |                                                  | *                         |
| GET    | /api/smartplug          | Returns info about your internet connected smartplug. (Tip: Use this to determine the ID of your smartplug. Use the `id` property.)                                                                |                                                  | *                         |
| GET    | /api/plug/:plugID       | Returns `true` or `false` for is_active state of a plug specified by plugID                                                                                                                        |                                                  | `{ "is_active": false }`  |
| POST   | /api/plug/:plugID       | [DIMMER] Change dimmer state when request body contains `"type": "dimmer"` and `"value": number`. When value is below `MIN_DIMMING_VALUE`, the dimmer will switch off.  Returns `is_active state`. | `{ "type": "dimmer", "value": 75 }`              | `{ "is_active": true }`   |
|        |                         | [SWITCH] Switches plug when request body contains `"type": "switch"` and `"value": "on/off"`. Returns `is_active` state                                                                            | `{ "type": "switch", "value": "on" }`            | `{ "is_active": true }`   |
|        |                         | [CURTAIN] Switches a Brel type curtain to either `"type": "brel_ud_curtain"` and `"value": "up/down/stop"`. Returns `is_active` state                                                              | `{ "type": "brel_ud_curtain", "value": "down" }` | `{ "is_active": true }`   |

`*` Try this yourself. Response contains a bunch of useful info and does not fit needly in this table.
## Contribution
This project was started by an IT-student as a small 2 day project to improve home-automation by enabling Home Assistant to control HomeWizard Lite plugs. Development will continue when I need more features. Contribution is appreciated.
