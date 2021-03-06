const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const yargs = require('yargs');

app.use(bodyParser.urlencoded({extended: true, limit: '200mb'}));
app.use(bodyParser.json({limit: '200mb'}));

// Command arguments
const args = yargs.argv;

// Log database
const logDB = require('./db.js').logDB;
logDB.start(args.db, (err) => {
  if (err) {
    console.log(err);
  }
});

const PORT = 18080;

// Serving static files
if (args.static) {
  console.log(args.static);
  app.use(express.static(args.static));
}

function sendResp(res, err, doc) {
  if (err) {
    res.status(doc.status).send(doc.reason);
  } else {
    if (doc) {
      //console.log(doc);
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
  let from = null;
  let to = null;
  if (req.query.from) {
    from = req.query.from;
  }
  if (req.query.to) {
    to = req.query.to;
  }
  console.log(from, to);
  logDB.logDevice(device, from, to, (err, data) => sendResp(res, err, data));
});

app.get('/applications', (req, res) => {
  logDB.applications((err, data) => sendResp(res, err, data));
});

app.get('/applications/:application', (req, res) => {
  let application = req.params.application;
  console.log(application);
  logDB.applicationsApplication(application, (err, data) => sendResp(res, err, data));
});

app.listen(PORT, () => {
  console.log('API server started');
});

