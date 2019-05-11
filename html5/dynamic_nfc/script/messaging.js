let mqtt = null;

// NDEF
const NDEF_IDENTIFIER_CODE_HTTP = '3';
const NDEF_IDENTIFIER_CODE_HTTPS = '4';

// Called when connected to MQTT server
function onConnect() {
  console.log('Connected to MQTT server');
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
  mqtt.connect(options);
  console.log('Connecting to MQTT server: ' + host)
}

function onUrlEntered() {
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
  msg.destinationName = "{}/rx".format(device);
  mqtt.send(msg);

  return false;
}

connect();
