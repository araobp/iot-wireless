# Chart GUI SPA (Single Page Application)

## Architecture

```
[main.html]<--MQTT/WebSocket---[mosquitto]<--MQTT---[gateway.py/gateway.js]<--BLE---[Sensor device]
     ^                               |                                      EnOcean
     |                               V                                      TWELITE
     +---------REST------------[API server]--[SQLite]
```

## SPA structure

```
   main.html
       |
       +-- script/main.js
       +-- use_cases/<script for each use case>
       +-- script/rendering.js
```
