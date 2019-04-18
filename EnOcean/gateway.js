// MQTT
const mqtt = require('mqtt');
const MQTT_SERVER = 'mqtt://localhost:1883';
const client = mqtt.connect(MQTT_SERVER);
const TOPIC = 'sensor';

// Serial port
const SerialPort = require('serialport');
const PORT = '/dev/serial/by-id/usb-EnOcean_GmbH_EnOcean_USB_400J_DA_FTXHAW8W-if00-port0';

const math = require('math');

function timestamp() {
  return new Date().getTime()/1000;
}

const port = new SerialPort(PORT, {
                         baudRate: 57600
                     });

const SWITCH = 0x20;  // PTM210J
const TEMP = 0x22;  // STM3xy

let connected = false;

port.on('data', data => {

  let porg = null;
  let value = 0;
  let pos = 0;
  let id = [];

  data.forEach(it => {
    if (it == 0x55) {  // sync byte
      pos = 0;
      porg = null;
      id.length = 0;
    } else {
      pos++;
      if (pos == 6) {
        switch(it) {
          case SWITCH:  // switch flag
            porg = SWITCH;
            break;
          case TEMP:
            porg = TEMP;
            break;
          default:
            break;
        }
      }
      if (pos >= 7 && pos < 11) {
        id.push(it.toString(16).padStart(2, '0'))
      }
      if (pos == 11 && porg == SWITCH) {
        // publish
        msg =  'switch-' + id.join('') + ',' + timestamp() + ',' + it;
        console.log(msg);
        if (connected) {
          client.publish(TOPIC, msg)
        }
      }
      if (pos == 13 && porg == TEMP) {
        let temp = math.round((255 - it) * 40 / 255, 1);
        msg = 'temp-' + id.join('') + ',' + timestamp() + ',' + temp;
        console.log(msg);
        if (connected) {
          client.publish(TOPIC, msg)
        }
      }
    }

  });
});


client.on('connect', () => {
  connected = true;
});
