#
# Gateway implementation for BLE peripherals based on bluepy.
#

from bluepy import btle
import paho.mqtt.client as mqtt
import argparse
import time
import math
import os
import sys

# MQTT topic to broadcast notifications from BLE peripheral
TOPIC = "sensor"

def timestamp():
    return math.floor(time.time()*1000)/1000

class EdgeAiDelegate(btle.DefaultDelegate):
    '''
    Edge AI delegate to receive notifications from BLE peripheral.
    '''

    def __init__(self, device_name, client, topic):
        btle.DefaultDelegate.__init__(self)
        self.device_name = device_name
        self.mqtt_client = client
        self.mqtt_topic = topic

    def handleNotification(self, cHandle, data):
        #print('handle: {}'.format(cHandle))
        #print(data)
        result = int.from_bytes(data, 'little', signed=False)
        print("result: {}".format(result))
        msg = "{},{:.3f},{}".format(self.device_name, timestamp(), result)
        self.mqtt_client.publish(self.mqtt_topic, msg)

class EdgeAiInterface():
    '''
    Interface to edge AI device as BLE peripheral.
    '''

    def __init__(self, conn, tx_chara_uuid, rx_chara_uuid):
        self.conn = conn
        self.tx_chara_uuid = tx_chara_uuid
        self.rx_chara_uuid = rx_chara_uuid
        self.write_char = self.conn.getCharacteristics(uuid=tx_chara_uuid)[0]

    def enable_notify(self):
        '''
        Enable notifications on the target characteristic.
        '''
        setup_data = b"\x01\x00"
        notify = self.conn.getCharacteristics(uuid=self.rx_chara_uuid)[0]
        notify_handle = notify.getHandle() + 1
        # In case of RN4020, write fails sometimes. Repeat write three times.
        for i in range(3):
            self.conn.writeCharacteristic(notify_handle, setup_data, withResponse=True)

    def on_message(self, client, userdata, message):
        '''
        Callback function to receive MQTT messages on the topic.
        This functon relays the received data to BLE peripheral.

        Caution: BLE ATT allows maximum data length of 23.
        '''
        cmd = message.payload
        print("cmd from mqtt bus: {}".format(cmd))
        # send the command to a BLE peripheral
        self.write_char.write(cmd, withResponse=False)


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--interface",
                                help="BLE interface number (hcix)", type=int, default=0)
    parser.add_argument("-d", "--device_name", help="BLE device name")
    parser.add_argument("-s", "--service_uuid", help="Service UUID")
    parser.add_argument("-t", "--tx_characteristic_uuid", help="TX characteristic UUID")
    parser.add_argument("-r", "--rx_characteristic_uuid", help="RX characteristic UUID")
    args = parser.parse_args()

    # Scan BLE peripherals
    scanner = btle.Scanner(args.interface)
    devices = scanner.scan(3.0)

    # BLE peripherals
    for device in devices:

        mac_address = None

        # Search for the device name
        for (adTypeCode, description, valueText) in device.getScanData():
            if valueText == args.device_name:
                #print(device.addr)
                print(device.addrType)
                #print(device.rssi)
                print(adTypeCode, description, valueText)
                mac_address = device.addr

        # Connect to the BLE peripheral 
        if mac_address: # If found
            peripheral = btle.Peripheral()
            if device.addrType == 'random':
                peripheral.connect(mac_address, btle.ADDR_TYPE_RANDOM) 
            else:
                peripheral.connect(mac_address) 

            desc_list = peripheral.getDescriptors()
            print('--- descriptors ---')
            for desc in desc_list:
                print(desc.uuid, desc.handle, str(desc))

            # List up characterstics supported by the peripheral
            for service in peripheral.getServices():
                if service.uuid == args.service_uuid:
                    print('--- services and characteristics ---')
                    for characteristic in service.getCharacteristics():
                        print('uuid: {}'.format(characteristic.uuid))
                        print('handle: {}'.format(characteristic.getHandle()))
                        print('property string: {}'.format(characteristic.propertiesToString()))
                        print()

            # Edge AI instance
            interface = EdgeAiInterface(peripheral, args.tx_characteristic_uuid,
                    args.rx_characteristic_uuid)
            interface.enable_notify()  # Enable BLE notify on the edge AI device

            # MQTT client setup 
            client = mqtt.Client("ble-router-interface{}".format(args.device_name))
            client.connect("localhost")
            client.on_message = interface.on_message
            client.subscribe(args.device_name)
            client.loop_start()  # MQTT client starts anohter thread

            # BLE notification callback function registration 
            peripheral.withDelegate(EdgeAiDelegate(args.device_name,
                                                client, TOPIC))

            # Inifinite loop for waiting notifications from BLE device
            while True:
                try:
                    if peripheral.waitForNotifications(1.0):
                        #print("Notification")
                        continue
                except: 
                    time.sleep(10)
                    python = sys.executable
                    os.execl(python, python, *sys.argv)

