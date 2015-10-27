var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
module.exports = io; 

var path = require('path');

var port = process.env.PORT;

var bodyParser = require('body-parser');

app.use(bodyParser.json());

require('./routes')(app);

app.get('/', function (req, res) {
  res.json({hello :'Hello'});
});

http.listen(port, function (){
   console.log('SERVER RUNNING... PORT: ' + port); 
});