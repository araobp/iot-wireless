import sqlite3
import time
import paho.mqtt.client as mqtt

TOPIC = "sensor"
DB = 'log.sqlite3'
TOPIC = 'sensor'

conn = None

def on_message(client, userdata, message):
    global conn

    if not conn:
        conn = sqlite3.connect(DB)

    msg = str(message.payload.decode("utf-8")).split(',')
    print(msg)
    device = msg[0]
    timestamp = msg[1]
    data = msg[2]
    if conn:
        conn.execute("insert into log values (?, ?, ?)", [device, timestamp, data])
        conn.commit()

if __name__ == '__main__':

    client = mqtt.Client("logger")
    client.connect('localhost')
    client.on_message = on_message
    client.subscribe(TOPIC)


    try:
        client.loop_start()
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        conn.close()

