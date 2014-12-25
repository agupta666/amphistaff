var express = require("express");
var app = express();
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

app.listen(8080);
