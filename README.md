# Wireless edge for IoT and AI

## Goal

- I will develop a gateway node that bridges between smart phones and IoT/EdgeAI.
- The system must be very easy to install or must support ad-hoc deployment.

```
  PC and smart phone    . . . . . . RasPi . . . . . . . . . . . .
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

I chose Redis for IoT/AI edge because of its small footprint.

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
