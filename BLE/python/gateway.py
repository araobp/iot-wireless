from bluepy import btle
import paho.mqtt.client as mqtt
import argparse
import time
import math

#DEVICE_NAME = 'RN079D'
#
#MAC_ADDRESS = None
#SERVICE_UUID = '11223344-5566-7788-9900-aabbccddeeff'
#CHARACTERISTIC_UUID = '01020304-0506-0708-0900-0a0b0c0d0e0f'

TOPIC = "sensor"

parser = argparse.ArgumentParser()
parser.add_argument("-i", "--interface",
                            help="BLE interface number (hcix)", type=int, default=0)
parser.add_argument("-d", "--device_name", help="BLE device name")
parser.add_argument("-s", "--service_uuid", help="Service UUID")
parser.add_argument("-c", "--characteristic_uuid", help="Characteristic UUID")
args = parser.parse_args()

def timestamp():
    return math.floor(time.time()*1000)/1000

def enable_notify(conn, chara_uuid):
    '''
    Enable NOTIFY on the target characteristic.
    '''
    setup_data = b"\x01\x00"
    notify = conn.getCharacteristics(uuid=chara_uuid)[0]
    notify_handle = notify.getHandle() + 1
    conn.writeCharacteristic(notify_handle, setup_data, withResponse=True)

class EdgeAiDelegate(btle.DefaultDelegate):
    '''
    Edge AI delegate to receive NOTIFY.
    '''

    def __init__(self, device_name, client, topic):
        btle.DefaultDelegate.__init__(self)
        self.device_name = device_name
        self.mqtt_client = client
        self.mqtt_topic = topic

    def handleNotification(self, cHandle, data):
        #print('handle: {}'.format(cHandle))
        inference_result = int.from_bytes(data, 'little', signed=False)
        print(inference_result)
        msg = "{}:{:.3f}:{}".format(self.device_name, timestamp(), inference_result)
        self.mqtt_client.publish(self.mqtt_topic, msg)

if __name__ == '__main__':

    scanner = btle.Scanner(args.interface)
    devices = scanner.scan(3.0)

    client = mqtt.Client("ble-router-interface{}".format(args.device_name))
    client.connect("localhost")

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

        if mac_address: # If found
            peripheral = btle.Peripheral()
            if device.addrType == 'random':
                peripheral.connect(mac_address, btle.ADDR_TYPE_RANDOM) 
            else:
                peripheral.connect(mac_address) 
            peripheral.withDelegate(EdgeAiDelegate(args.device_name,
                                                client, TOPIC))

            for service in peripheral.getServices():
                if service.uuid == args.service_uuid:
                    print('--- services and characteristics ---')
                    for characteristic in service.getCharacteristics():
                        print(characteristic.uuid)
                        print(characteristic.getHandle())
                        print(characteristic.propertiesToString()) 
                        pass

            enable_notify(peripheral, args.characteristic_uuid)

            while True:
                if peripheral.waitForNotifications(1.0):
                    #print("Notification")
                    continue
