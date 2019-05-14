const mqtt = require('mqtt');

const MQTT_SERVER = 'mqtt://localhost:1883'
const TOPIC = 'BLE2/tx'

let client = mqtt.connect(MQTT_SERVER);

client.on('connect', () => {

    client.subscribe(TOPIC);
    });

client.on('message', (topic, message) => {
    console.log(message.toString());
    });




