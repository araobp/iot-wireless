const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true, limit: '200mb'}));
app.use(bodyParser.json({limit: '200mb'}));

const logDB = require('./db.js').logDB;

logDB.start((err) => {
  if (err) {
    console.log(err);
  }
});

const PORT = 18080;

function sendResp(res, err, doc) {
  if (err) {
    res.status(doc.status).send(doc.reason);
  } else {
    if (doc) {
      console.log(doc);
      res.send(doc);
    } else {
      res.send();
    }
  }
}

app.get('/devices', (req, res) => {
  logDB.devices((err, data) => sendResp(res, err, data));
});

app.get('/log', (req, res) => {
  logDB.log((err, data) => sendResp(res, err, data));
});

app.get('/log/:device', (req, res) => {
  let device = req.params.device;
  let body = req.body;
  let from = null;
  let to = null;
  if (body) {
    from = body.from;
    to = body.to;
  }
  logDB.logDevice(device, from, to, (err, data) => sendResp(res, err, data));
});

app.listen(PORT, () => {
  console.log('API server started');
});

