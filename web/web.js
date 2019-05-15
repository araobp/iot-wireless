const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');
const yargs = require('yargs');

const PORT = 443 

app.use(bodyParser.urlencoded({extended: true, limit: '200mb'}));
app.use(bodyParser.json({limit: '200mb'}));

// Command arguments
const args = yargs.argv;

app.use(express.static(args.static));

https.createServer({
  key: fs.readFileSync('./web/server.key'),
  cert: fs.readFileSync('./web/server.cert')
}, app)
.listen(PORT, () => {
  console.log('Web server started');
});
