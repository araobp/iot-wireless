let mqtt = null;

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

  //TODO: https
  //
  console.log(app.devices, http_url[1]);
  let msg = new Paho.MQTT.Message(http_url[1]);
  msg.destinationName = device;
  mqtt.send(msg);

  return false;
}

connect();
