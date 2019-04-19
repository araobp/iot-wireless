// SQLite3 connection
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('log.sqlite3');

// MQTT sensor event subscription
const mqtt = require('mqtt');
const MQTT_SERVER = 'mqtt://localhost:1883'
const TOPIC = 'sensor';

exports.logDB = {

  start: function(callback) {
    let client = mqtt.connect(MQTT_SERVER);
    client.on('connect', () => {
      client.subscribe(TOPIC);
    });
    client.on('message', (topic, message) => {
      console.log(message.toString());
			msg = message.toString().split(',');
      db.run('insert into log (device, timestamp, data) values ($n, $t, $d)',
      {
        $n: msg[0],
        $t: msg[1],
        $d: msg[2]
      });
    });
    callback(true);
  },

  devices: function(callback) {
    let device_list = [];
    db.all('select distinct device from log', (err, data) => {
      data.forEach(it => {
        device_list.push(it.device);
      });
      callback(err, device_list);
    });
  },

  log: function(callback) {
    db.all('select * from log', (err, data) => {
      callback(err, data);
    });
  },

  logDevice: function(device, callback) {
    db.all('select * from log where device=$device',
      {$device: device},
      (err, data) => {
        callback(err, data);
    });
  }

}


