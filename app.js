var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var savedSocket;



var bodyParser = require('body-parser');
var redis = require("redis");
var client = redis.createClient();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
  client.get('GLOBAL_DATA', function(err, reply){
    res.render("index.jade", { payload: reply});
  });
});

app.get("/data", function (req, res) {
  client.get('GLOBAL_DATA', function(err, reply){
    res.json(JSON.parse(reply));
  });
});

app.post("/save", function (req, res) {
  var data = req.param('data');
  client.set('GLOBAL_DATA', data);
  res.redirect('/');
})

app.post("/response", function (req, res) {
  savedSocket.emit('response', req.body);
  res.json({ 'status' : 'ok' });
});


io.on('connection', function (socket) {
  savedSocket = socket;
});

server.listen(8080);
