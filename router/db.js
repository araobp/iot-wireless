// SQLite3 connection
let sqlite3 = require('sqlite3').verbose();

// MQTT sensor event subscription
const mqtt = require('mqtt');
const MQTT_SERVER = 'mqtt://localhost:1883'
const TOPIC = 'sensor';

let db = null;

exports.logDB = {

  start: function(database, callback) {

    db = new sqlite3.Database(database);

    let client = mqtt.connect(MQTT_SERVER);
    client.on('connect', () => {
      client.subscribe(TOPIC);
    });
    client.on('message', (topic, message) => {
      //console.log(message.toString());
			let msg = message.toString().split(',');
      let device = msg[0];
      let timestamp = msg[1];
      let data = msg.slice(2).join();
      db.run('insert into log (device, timestamp, data) values ($n, $t, $d)',
      {
        $n: device,
        $t: timestamp,
        $d: data
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

  logDevice: function(device, from, to, callback) { if (from && to < 0) {
      db.all('select * from log where device=$device and timestamp >= $from',
        {$device: device, $from: from},
        (err, data) => {
          callback(err, data);
      });
    } else if (from && to) {
      db.all('select * from log where device=$device and timestamp >= $from and timestamp <= $to',
        {$device: device, $from: from, $to: to},
        (err, data) => {
          callback(err, data);
      });
    } else {
      db.all('select * from log where device=$device',
        {$device: device},
        (err, data) => {
          callback(err, data);
      });
    }
  },

  applications: function(callback) {
    let applications_list = [];
    db.all('select distinct application from applications', (err, data) => {
      data.forEach(it => {
        applications_list.push(it.application);
      });
      callback(err, applications_list);
    });
  },

  applicationsApplication: function(application, callback) {
    db.all('select * from applications where application=$application',
      {$application: application},
      (err, data) => {
        data = data[0];
        data.devices = data.devices.split(',');
        callback(err, data); 
      });
  }
}

