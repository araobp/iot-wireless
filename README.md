# Wireless edge for IoT and AI

## Motivation

I saw Bluetooth router products developed by [Cassia Networks](https://www.cassianetworks.com/) at a trade show held in Tokyo in April 2019. BLE is not only for 1:1 but also 1:N, that sounds good for IoT networking.

## Goal

- I will develop a gateway node that bridges between smart phones and IoT/EdgeAI.
- The system must be very easy to install or must support ad-hoc deployment.

```
   Chrome          . . . . . . RasPi . . . . . . . .                                     STM32 or PIC16F1
[spa(Vue.js)]<------[mosquitto]<-------[gateway.py]<--[Comm. module]<- - wireless - - -[IoT node or edge AI]
        ^                                  |                     (BLE, EnOcean or TWELITE)
        |                                  V
        +-----------[api.py(Flask)]<---[sqlite3]
                   . . . . . . RasPi . . . . . . . .                                    
```

### Hardware of the gateway node

Single board PCs such as RasPi. In other words, Ubuntu Linux on Arm Cortex-A MPU.

## Wireless networking for IoT and edge AI

```
        +---------+
        |         |<---[agent.py]<----[BLE: Microchip RN4020] (American)
    <---|mosquitto|<---[agent.js]<----[EnOcean: EnOcean USB400J] (German)
        |         |<---[agent.py]<----[TWELITE: MONO WIRELESS MONOSTICK] (Japanese)
        +---------+
```

**==> [BLE (Microchip RN4020)](./BLE)**

**==> [EnOcean (EnOcean GmbH)](./EnOcean)**

**==> [TWELITE (MONO WIRELESS)](./TWELITE)**

### Messaging

#### Notifications: sensors to applications

MQTT topic: "sensor"
MQTT message format: "{<source ID>},{<timestamp(:.3f)>},{<data0>},{<data1>},...
  
Time stamp format: <epoch time in seconds>.<msec part of epoch time>

Note: when it comes to wireless IoT, my experiences in my past IoT projects proves that MQTT messaging should use a CSV format (or binary) rather than JSON.

#### Commands: applications to sensors

MQTT topic: "command"
MQTT message format: "{<destination ID>},{<command>}

### Database and API server

- In this project, I use SQLite, because I want to run everything on RasPi.
- I use Flask as a web framework to implement RESTful API server.

### Demo GUI

In this project, [a single page application (SPA)](./spa) is used for showing an inference result from an edge AI simulator.

