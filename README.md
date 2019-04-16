# Wireless edge for IoT and AI

## Motivation

I saw Bluetooth router products developed by [Cassia Networks](https://www.cassianetworks.com/) at a trade show held in Tokyo in April 2019. BLE is not only for 1:1 but also 1:N, that sounds good for IoT networking.

## Goal

- I will develop a gateway node that bridges between smart phones and IoT/EdgeAI.
- The system must be very easy to install or must support ad-hoc deployment.

```
  PC and smart phone    . . . . . . RasPi . . . . . . . . . . . .                             STM32 or PIC16F1
[Vue.js-based SPA]<-----[Messaging such as MQTT]<---[agent.js]<---[Comm. module]<--wireless--[IoT node or edge AI]
        ^                                               |
        |                                               V
        +-------------[Node.js-based web server]<---[Database]
                        . . . . . . RasPi . . . . . . . . . . . .                                    
```

### Hardware of the gateway node

Single board PCs such as RasPi. In other words, Ubuntu Linux on Arm Cortex-A MPU.

## Wireless networking for IoT and edge AI

I use wireless communication modules supporting operations on UART for prototyping IoT and edge AI.

**==> [BLE (Microchip RN4020)](./RN4020)**

**==> [EnOcean (EnOcean GmbH)](./EnOcean)**

**==> [TWELITE (MONO WIRELESS)](./TWELITE)**

### Database

In this project, I use Redis because of its small footprint. I use Redis's ZADD command (sorted list) for storing time-series data.

### Demo GUI

In this project, [a single page application (SPA)](./spa) is used for showing an inference result from an edge AI simulator.

