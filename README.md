# Wireless edge for IoT and AI

## Motivation

I saw Bluetooth router products developed by [Cassia Networks](https://www.cassianetworks.com/) at a trade show held in Tokyo in April 2019. BLE is not only for 1:1 but also 1:N, that sounds good for IoT networking.

## Goal

- I will develop a gateway node that bridges between smart phones and IoT/EdgeAI.
- The system must be very easy to install or must support ad-hoc deployment.

```
  PC and smart phone    . . . . . . RasPi . . . . . . . . . . . .                             STM32 or PIC16F1
[Vue.js-based SPA]<-----[Messaging such as MQTT]<---[Gateway]<---[Comm. module]<--wireless--[IoT node or edge AI]
        ^                                               |
        |                                               V
        +-------------[Node.js-based web server]<---[Database]
                        . . . . . . RasPi . . . . . . . . . . . .                                    
```

### Hardware of the gateway node

Single board PCs such as RasPi. In other words, Ubuntu Linux on Arm Cortex-A MPU.

### Wireless networking

In this projects, the following wireless networking technologies are studied:
- BLE
- TWELITE
- EnOcean
- LoRa

I use wireless communication modules supporting operations on UART for prototyping IoT and edge AI.

### Database

I used to use Redis, Cassandra and ZooKeeper in my past projects.

In this project, I use Redis because of its small footprint. I use Redis's ZADD command (sorted list) for storing time-series data.

### Messaging

MQTT is the most popular. I will also study other messaging technologies such as Redis pubsub.

### Demo GUI

In this project, [a single page application (SPA)](./spa) is used for showing an inference result from an edge AI simulator.

## Wireless networking for IoT and edge AI

### Bluetooth Low Energy

**==> [BLE(Microchip RN4020)](./RN4020)**

### TWELITE

Although TWELITE is not so reliable, it is very cheap.

**==> [TWELITE](./TWELITE)**

### EnOcean

I used EnOcean just as a wireless switch to turn on LED.

### LoRa

I used LoRa for wireless communication in mountians.
