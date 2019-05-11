const mqtt = require('mqtt');

const MQTT_SERVER = 'mqtt://localhost:1883'
const TOPIC = 'sensor/test'

let client = mqtt.connect(MQTT_SERVER);
let n = 0
let m = 0

function timestamp() {
  return new Date().getTime()/1000;
}

function publisher() {
  data = [++n, --m].toString();
  msg =  'pub'  + ',' + timestamp() + ',' + data; 
  client.publish(TOPIC, msg);
}

client.on('connect', () => {
  setInterval(publisher, 1000);
});





