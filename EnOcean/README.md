# EnOcean

## Agent code

**==>[agent.js](./agent.js)**

## ESP3 packet examples

[PTM210J Push button multi-channel switch module](https://www.enocean.com/en/enocean-modules-928mhz/details/ptm-210j/)
```
Header(0,1): 55
Data Length(1,3): 00 07
Optional Length(3,4): 02
Packet Type(4,5): 0a
CRC8(5,6): 0a
PORG(6,7): 20
Source ID(7,11): XX XX XX XX
Status(11,12): 84
CRC8(12,13): a1
Telegram Number(13,14): 01
RSSI(14,15): 37
CRC(15,16): 90
```

[STM3xy Energy harvesting wireless temperature sensor module - including solar cell and helical antenna](https://www.enocean.com/en/enocean-modules/details/stm-331/)
```
Header(0,1): 55
Header Length(1,3): 00 0a
Optional Length(3,4): 02
Packet Type(4,5): 0a
CRC8(5,6): 9b
PORG(6,7): 22
Source ID(7,11): XX XX XX XX
Temperature(11,14): 00 00 5c 
LRNbit(14,15): 08
CRC8(15,16): 9c
Telegram Number(16,17): 01
RSSI(17,18): 29
CRC(18,19): ca
```
