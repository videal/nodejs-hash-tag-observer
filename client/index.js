var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT;

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname, 'view'));

app.use(express.static(path.resolve(__dirname)));

app.get('/', function (req, res) {
  res.render('index.jade');
});

app.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
})