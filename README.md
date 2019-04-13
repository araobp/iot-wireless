# Wireless edge for IoT and AI

## Goal

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

## Wireless 

### Bluetooth Low Energy

**==> [BLE(Microchip RN4020)](./RN4020)**

### TWELITE

Although TWELITE is not so reliable, it is very cheap.

**==> [TWELITE](./TWELITE)**

### EnOcean

I used EnOcean just as a wireless switch to turn on LED.

### LoRa

I used LoRa for wireless communication in mountians.
