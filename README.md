# Wireless edge for IoT and AI

## Motivation

I saw Bluetooth router products developed by [Cassia Networks](https://www.cassianetworks.com/) at a trade show held in Tokyo in April 2019. BLE is not only for 1:1 but also 1:N, that sounds good for IoT networking.

## Goal

- I will develop a gateway node that bridges between smart phones and IoT/EdgeAI.
- The system must be very easy to install or must support ad-hoc deployment.

```
  PC and smart phone    . . . . . . RasPi . . . . . . . . . . . .                             STM32 or PIC16F1
[Vue.js-based SPA]<-----[Messaging such as MQTT]<---[agent.js/py]<---[Comm. module]<--wireless--[IoT node or edge AI]
        ^                                               |
        |                                               V
        +-------------[Node.js-based web server]<---[Database]
                        . . . . . . RasPi . . . . . . . . . . . .                                    
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

### Database

In this project, I use MongoDB. Refer to [this project](https://github.com/araobp/api-server) that implemented Node.js-based API server with MongoDB.

### Demo GUI

In this project, [a single page application (SPA)](./spa) is used for showing an inference result from an edge AI simulator.

