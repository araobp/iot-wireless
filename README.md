# Wireless edge for IoT and AI

(Work in progress)

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
        +------------------[api.js]<---[sqlite3]
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

### Low-power wireless

- My conclusion in this project is that Microchip RN4020 BLE module (Bluetooth 4.2 BLE) is the most useful wireless module. RN4020 is also easy to use. 
- I have also evaluated X-CUBE-IDB05A1 with X-CUBE-BLE1, but the software package is not easy to use.
- Although I have not tested Bluetooth 5 yet, it even supports long range and AoA (Angle of Arrival). I am not going to use TWELITE and LoRa in my upcoming projects, because they can be replaced with Bluetooth 5.
- The best application of EnOcean is energey-harvesting switch, but EnOcean is not one and only choice.

**==> [BLE (Microchip RN4020)](./BLE)**

==> [EnOcean (EnOcean GmbH)](./EnOcean)

==> [TWELITE (MONO WIRELESS)](./TWELITE)

### Messaging

#### Notifications: sensors to applications

```
MQTT topic: "sensor"
MQTT message format: "{<source device name>},{<timestamp(:.3f)>},{<data0>},{<data1>},...
```

Time stamp format: <epoch time in seconds>.<msec part of epoch time>

Note: when it comes to wireless IoT, my experiences in my past IoT projects proves that MQTT messaging should use a CSV format (or binary) rather than JSON that add a lot of overhead.

#### Commands: applications to sensors

```
MQTT topic: <destination device name> 
MQTT message format: <command>
```
### Database and API server

- In this project, I use SQLite, because I want to run everything on RasPi.
- I use node.js as a web framework to implement RESTful API server.

==> **[RESTful API server with sqlite3](./api)**

### Demo GUI

In this project, [a single page application (SPA)](./spa) is used for showing an inference result from an edge AI simulator.

