// MQTT message serial number
let sno = 0;

// Called when MQTT message has arrived 
function onMessageArrived(msg) {

  let data = msg.payloadString;
  //console.log(data);
  data = data.split(',')
  let device_name = data[0];
  if (device_name == app.device_name) {

    let epoch_time = parseFloat(data[1]) * 1000;  // milliseconds
    let date_time = new Date(epoch_time);
    app.timestamp = date_time;
    sno = sno + 1;
    app.sno = sno;

    let payload = data[2];
    updateMessage(payload);
    updateChart(date_time, payload, sno);
  }
}

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
  mqtt.onMessageArrived = onMessageArrived
  mqtt.connect(options);
  console.log('Connecting to MQTT server: ' + host)
}

// Called when one of the radio buttons is checked
function onButtonChecked() {
  let form = document.getElementById("select");
  let current = document.getElementById("current");
  let past = document.getElementById("past");
  if (form.operation.value == "current") {
    if (app.device_name) {
      mqtt.subscribe("sensor/" + app.device_name);
    }
    current.style.display = "block";
    past.style.display = "none";
    chart.data.datasets[0].data = [];
    chart.data.labels = [];
    chart.update();
  } else if (form.operation.value == "past") {
    if (app.device_name) {
      mqtt.unsubscribe("sensor/" + app.device_name);
    }
    current.style.display = "none";
    past.style.display = "block";
    // Set default datetime
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let now = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    document.querySelector('input[name="from"]').value = now;
    document.querySelector('input[name="to"]').value = now;
  }
}

// Called when date and time is entered 
function onDateTimeEntered() {
  let from = document.querySelector('input[name="from"]');
  let to = document.querySelector('input[name="to"]');
  from = new Date(from.value).getTime()/1000.0;  // Epoch time in seconds
  to = new Date(to.value).getTime()/1000.0;  // Epoch time in seconds

  get('/log/' + app.device_name + queryParams({from: from, to: to}), drawChart);
  
  return false;
}

// Initiate a connection to MQTT server
connect();
