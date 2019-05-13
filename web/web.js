const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const yargs = require('yargs');

const PORT = 80 

app.use(bodyParser.urlencoded({extended: true, limit: '200mb'}));
app.use(bodyParser.json({limit: '200mb'}));

// Command arguments
const args = yargs.argv;

app.use(express.static(args.static));

app.listen(PORT, () => {
  console.log('Web server started');
});
