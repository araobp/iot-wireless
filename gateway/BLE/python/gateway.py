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
import traceback

def restart():
    time.sleep(10)
    print("Restarting BLE gateway...")
    python = sys.executable
    os.execl(python, python, *sys.argv)

def timestamp():
    return math.floor(time.time()*1000)/1000

class EdgeAiDelegate(btle.DefaultDelegate):
    '''
    Edge AI delegate to receive notifications from BLE peripheral.
    '''

    def __init__(self, device_name, client):
        btle.DefaultDelegate.__init__(self)
        self.device_name = device_name
        self.mqtt_client = client
        self.mqtt_topic = "sensor/{}".format(device_name)
        self.mqtt_resp_topic = "{}/tx".format(device_name)
        self.receiving = False
        self.buf = ''

    def handleNotification(self, cHandle, data):
        #print('handle: {}'.format(cHandle))
        #print(data)
        data = data.decode('utf-8')
        if self.receiving:
            result = data
            self.buf = self.buf + result
            if result[-1] == '\n':
                print("response: {}".format(self.buf))
                msg = "{},{:.3f},{}".format(self.device_name, timestamp(), self.buf)
                self.mqtt_client.publish(self.mqtt_resp_topic, msg)
                print(self.mqtt_resp_topic, msg)
                self.buf = ''
                self.receiving = False

        elif data[0] == 'R':  # Response to read request
            data = data.split(',')
            result = data[1]
            if result[-1] == '\n':
                print("response: {}".format(result))
                msg = "{},{:.3f},{}".format(self.device_name, timestamp(), result)
                self.mqtt_client.publish(self.mqtt_resp_topic, msg)
                print(self.mqtt_resp_topic, msg)
            else:
                self.buf = self.buf + result
                self.receiving = True
        elif data[0] == 'W': 
            data = data.split(',')
            result = int(data[1])
            print("result: {}".format(result))
            msg = "{},{:.3f},{}".format(self.device_name, timestamp(), result)
            self.mqtt_client.publish(self.mqtt_topic, msg)
        else:
            print('unidentified response')


class EdgeAiInterface():
    '''
    Interface to edge AI device as BLE peripheral.
    '''

    def __init__(self, conn, tx_chara_uuid, rx_chara_uuid):
        self.conn = conn
        self.tx_chara_uuid = tx_chara_uuid
        self.rx_chara_uuid = rx_chara_uuid
        self.write_char = self.conn.getCharacteristics(uuid=rx_chara_uuid)[0]

    def enable_notify(self):
        '''
        Enable notifications on the target characteristic.
        '''
        setup_data = b"\x01\x00"
        notify = self.conn.getCharacteristics(uuid=self.tx_chara_uuid)[0]
        notify_handle = notify.getHandle() + 1
        # In case of RN4020, write fails sometimes. Repeat write three times.
        for i in range(3):
            self.conn.writeCharacteristic(notify_handle, setup_data, withResponse=True)
            time.sleep(1)

    def on_message(self, client, userdata, message):
        '''
        Callback function to receive MQTT messages on the topic.
        This functon relays the received data to BLE peripheral.

        Caution: BLE ATT allows maximum data length of 23.
        '''
        cmd = message.payload
        print("cmd from mqtt bus: {}".format(cmd))
        # send the command to a BLE peripheral
        cmd = [cmd[i:i+20] for i in range(0, len(cmd), 20)] 
        print(cmd)
        for c in cmd:
            self.write_char.write(c, withResponse=False)
            time.sleep(0.5)

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
            print(valueText)
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
            client.subscribe(args.device_name+"/rx")
            client.loop_start()  # MQTT client starts anohter thread

            # BLE notification callback function registration 
            peripheral.withDelegate(EdgeAiDelegate(args.device_name,
                                                client))

            # Inifinite loop for waiting notifications from BLE device
            while True:
                try:
                    if peripheral.waitForNotifications(1.0):
                        #print("Notification")
                        continue
                except: 
                    traceback.print_exc()
                    restart()

    # Device not found
    restart()

