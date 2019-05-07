# RasPi-based router for wireless IoT and edge AI

(Work in progress)

## Motivation 1: Bluetooth is becoming wireless transport for IoT

- I have not been thinking of BLE as wireless transport for IoT so far, but Bluetooth 5 has some enhancements for IoT: mesh networking and AoA(Angle of Arrival).
- I saw Bluetooth router products developed by [Cassia Networks](https://www.cassianetworks.com/) at a trade show held in Tokyo in April 2019. I got that BLE is not only for 1:1 but also 1:N.
- RasPi (BlueZ) supports BLE, and its Python wrapper, bluepy, is very easy to use.

## Motivation 2: From cloud computing to edge computing

- RasPi has enough processing power for handling IoT time-series data, so why not just use it as an IoT platform.
- RasPi has four cores, so it can handle data from mulitple network interfaces in paralell.
- If its I/O bottleneck matters, connect SSD to it.

## Goal

- Develop a router that bridges between smart phones and IoT/EdgeAI.
- Support low-power wireless transport: BLE (main), EnOcean, NFC and TWELITE(IEEE802.15.4-based).
- Very easy to install or support ad-hoc deployment.
- Support IoT/AI applications as SPA and as standalone processes (or as Docker containers).
- Support device management for the router and IoT/AI nodes.

```
                   ============== ROUTER ===============
   Chrome          . . . . . . RasPi . . . . . . . . . .                                      STM32 or PIC16F1
[spa(Vue.js)]<----->[mosquitto]<--->[gateway.py]<--->[Comm. module]<- Low-power wireless - >[IoT node or edge AI]
        ^          :     |                             :             BLE, EnOcean, NFC etc
        |          :     V                             :
        +----------->[api.js(node/express)]--[sqlite3] :
                   :     |                             : 
                   : [IoT/AI applications]             :       
                   . . . . . . . . . . . . . . . . . . .                                   
```

### Hardware of the router

Single board PCs such as RasPi. In other words, Ubuntu Linux on Four-core Arm Cortex-A53 MPU at 1.2GHz.

## Low-power wireless networking for IoT and edge AI

```
        +---------+
        |         |<---[gateway.py]<----[BLE: Microchip RN4020] (American)
    <---|mosquitto|<---[gateway.js]<----[EnOcean: EnOcean USB400J] (German)
        |         |<---[gateway.py]<----[TWELITE/IEEE802.15.4: MONO WIRELESS MONOSTICK] (Japanese)
        +---------+
        
       Note: NFC device is remote-controlled via BLE.
```

### Gateway(adaptor) for low-power wireless

My conclusion in this project is that Microchip RN4020 BLE module (Bluetooth 4.2 BLE) is the most useful wireless module for IoT prototyping. RN4020 is also easy to use. 

**==> [BLE (Microchip RN4020)](./gateway/BLE)**

==> [EnOcean (EnOcean GmbH)](./gateway/EnOcean)

==> [TWELITE (MONO WIRELESS)](./gateway/TWELITE)

### Messaging

#### Notifications: sensors to applications

```
MQTT topic: "sensor"
MQTT message format: "{<source device name>},{<timestamp(:.3f)>},{<data0>},{<data1>},...
```

Time stamp format: <epoch time in seconds>.<msec part of epoch time>

Note: when it comes to wireless IoT, my experiences in my past IoT projects proves that MQTT messaging should use a CSV format (or binary) rather than JSON that adds a lot of overhead.

#### Commands: applications to sensors

```
MQTT topic: <destination device name> 
MQTT message format: <command>
```
### Database and API server

- In this project, I use SQLite, because I want to run everything on RasPi.
- I use node.js as a web framework to implement RESTful API server.

==> **[RESTful API server with sqlite3](./server)**

### Demo GUI

In this project, [a single page application (SPA)](./demo/gui) is used for showing an inference result from an edge AI simulator.

### IoT nodes and edge AI devices

- [Dynamic NFC tag with RN4020](./demo/device/stm32/Dynamic_NFC_tag_with_RN4020)
