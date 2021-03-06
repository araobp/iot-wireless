# Dynamic NFC/RFID tag (STMicro's ST25DV04K) with RN4020

## Application abstract

RN4020 as a BLE module receives URI write requests from a BLE central (RasPi), and transfer the requests to STM32. STM32 writes the URI to NFC tag via I2C everytime it receives a request.

Pushing rich user interface to the user's smartphone via NFC tag:
```
                                                                          Dynamic NFC tag
    [RasPi (BLE central)]---BLE--->[RN4020(BLE peripheral)][STM32]---I2C--->[ST25DV04K]---NFC--->[Smart phone]

```

Bi-directonal communication with MCU via NFC (WiFi/BLE not involved):
```
                         Local event
                              |
                              V                                  Dynamic NFC tag
    [RN4020(BLE peripheral)][STM32]---I2C--->[ST25DV04K]---NFC--->[Smart phone]

    [RN4020(BLE peripheral)][STM32]<--I2C----[ST25DV04K]<--NFC----[Smart phone]
                              ^                  GPO
                              |                   |
                              +-------------------+
                                   Interrupt
```

## Dynamic NFC tag

A MCU can communicate with a smart phone via dynamic NFC tag. The chip "ST25DV04K" supports bi-directional communication in a passive way, so it can be thought of a reader/writer powerd by a smartphone via RF. Adopt dynamic NFC tag instead of LCD!

- [X-NUCLEO-NFC04A1](https://www.st.com/en/ecosystems/x-nucleo-nfc04a1.html)
- [ST25DV04K(Dynamic NFC tag)](https://www.st.com/en/nfc/st25dv04k.html)
- ["NFC Tap" Android app for ST25](https://www.st.com/content/st_com/en/products/embedded-software/st25-nfc-rfid-software/stsw-st25001.html)
- [ST25 SDK(jar)](https://my.st.com/content/my_st_com/en/products/embedded-software/st25-nfc-rfid-software/stsw-st25sdk001.html)
- [ST25 Webapp(html5)](https://smarter.st.com/st25-nfc-web-application/?icmp=tt7281_gl_lnkon_may2018)

### ST25DV04K

- 256 bytes buffer for fast transfer
- 4Kbits EEPROM

## URI write request to the device (BLE write request)

The BLE characteristics defined in [this page](https://github.com/araobp/iot-wireless/tree/master/gateway/BLE) is used in this project.

URI write request message format (proprietary):

```
     +-----------------------+
     |  NDEF URL identifier  |
     +-----------------------+
     |  ','                  |
     +-----------------------+
     |  URI field[0]         |
     +-----------------------+
     |  URI field[1]         |
     +-----------------------+
     |       :               |
     |       :               |
     +-----------------------+
     |  URI field[n]         |
     +-----------------------+
     |  '\n'                 |
     +-----------------------+

```

Example: 3,amazon.co.jp\n

Due to the limitation of BLE payload size (max. 20bytes), the request message is split into multiple data.

Response to URI write request:
```
     +-----------------------+
     |  'W'                  |
     +-----------------------+
     |  ','                  |
     +-----------------------+
     | Count (in ASCII)      | The number of requests that have been received by the device so far.
     +-----------------------+
     |  '\n'                 |
     +-----------------------+

```


## URI read request to the device (BLE write request)

```
     +-----------------------+
     |  '0'                  |
     +-----------------------+
```

When the beginning character is '0', the request message is regarded as "read URI from the NFC tag".

Response to URI write request:
```
     +-----------------------+
     |  'R'                  |
     +-----------------------+
     |  ','                  |
     +-----------------------+
     |  URI field[0]         |
     +-----------------------+
     |  URI field[1]         |
     +-----------------------+
     |       :               |
     +-----------------------+
     |  URI field[n]         |
     +-----------------------+
     |  '\n'                 |
     +-----------------------+

```

Due to the limitation of BLE payload size (max. 20bytes), the response message is split into multiple data.

## Web NFC

Results from my experiments so far:
- I have confirmed that Web NFC on Chrome/Android can read NDEF message from ST25 or write NDEF message to ST25. However, to enable NFC on Chrome, you need to access chrome://flags.
- Safari on iPhone does not support Web NFC.

Conclusion:
- I do not use Web NFC, since iPhone does not support it.
- Both Android and iPhone read NFC tag in a background process and lauch a browser automatically. I focus on this way to remote-control a browser on a smartphone. Use GPO supported by ST25 to detect if the user is close to the tag.

## GPO (General Purpose Output) supported by ST25

I use GPO to detect RF activities such as FIELD_CHANGE in this project.

FIELD_CHANGE events (turn into interrupts on EXTI on STM32).
```

         +--+                               +--+           HIGH
         |  |                               |  |
   ------+  +-------------------------------+  +---------- LOW

```

The following line must be included somewhere in the code to receive interrupts from PA6:
```
NFC04A1_GPO_Init();
```

## Collision problem

I was going to use USART1 for RN4020, but USART1's RX (PA10) is already used by X-CUBE-NFC4/X-NUCLEO-NFC05A1 for YELLOW LED.

So I use USART6 instead.

## A bug in X-CUBE-NFC4/CubeMX

BSP folder is removed whenever code is generated by CubeMX after the initial generation. Copy BSP into the folder manually to cope with the problem.
