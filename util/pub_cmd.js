const mqtt = require('mqtt');

const MQTT_SERVER = 'mqtt://localhost:1883'

const DST = 'BLE2';
const DATA = 'amazon.co.jp'; 

let client = mqtt.connect(MQTT_SERVER);

client.on('connect', () => {
  client.publish(DST, DATA);
});

