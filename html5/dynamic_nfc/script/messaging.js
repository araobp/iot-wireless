let mqtt = null;

const IDENTIFIER_CODE_READ_REQUEST = '0';

// NDEF
const NDEF_IDENTIFIER_CODE_HTTP = '3';
const NDEF_IDENTIFIER_CODE_HTTPS = '4';

function onMessageArrived(msg) {
  console.log(msg);
  app.urlRead = msg.payloadString;
}

// Called when connected to MQTT server
function onConnect() {
  console.log('Connected to MQTT server');
  mqtt.onMessageArrived = onReadResponseArrived;
  if (app.devices) {
    mqtt.subscribe(app.devices + "/tx");
  }
}

// Connect to MQTT server
function connect() {
  const host = window.location.hostname
  const port = 11883  // MQTT over WebSocket
  mqtt = new Paho.MQTT.Client(host, port, uuidv4());

  let options = {
    timeout: 3,
    onSuccess: onConnect,
  };
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.connect(options);
  console.log('Connecting to MQTT server: ' + host)
}

function onWriteRequested() {
  let device = app.devices;
  let url = app.url;
  let http_url = /^http:\/\/(.*)/.exec(url);
  let https_url = /^https:\/\/(.*)/.exec(url);
  let code = null;
  if (http_url) {
    code = NDEF_IDENTIFIER_CODE_HTTP;
    url = http_url[1];
  } else if (https_url) {
    code = NDEF_IDENTIFIER_CODE_HTTPS;
    url = https_url[1];
  }

  let msg = new Paho.MQTT.Message(code + ',' + url + '\n');
  //console.log(msg);
  msg.destinationName = device + "/rx";
  mqtt.send(msg);

  return false;
}

function onReadRequested() {
  let device = app.devices;
  let code = IDENTIFIER_CODE_READ_REQUEST; 

  let msg = new Paho.MQTT.Message(code);
  //console.log(msg);
  msg.destinationName = device + "/rx";
  console.log(msg);
  mqtt.send(msg);

  return false;
}

function onReadResponseArrived(msg) {
  app.urlRead = msg.payloadString.split(',')[2];
}

connect();
