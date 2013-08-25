var pg = require('pg');
var fs = require('fs');
var express = require('express');
var util = require('util');

//Postres connection
if(process.env.DATABASE_URL){//we are on heroku
    connectionString = process.env.DATABASE_URL;
    var client = new pg.Client(connectionString);
    client.connect();
}
else{//we are on ec2
    //format of conString = "postgres://user:password@host:port/dbname";
    var PGPASS_FILE = '../.pgpass';
    var pgtokens = fs.readFileSync(PGPASS_FILE).toString().split(':');
    var host = pgtokens[0];
    var port = pgtokens[1];
    var dbname = pgtokens[2];
    var user = pgtokens[3];
    var password = pgtokens[4];
    var conString = "postgres://" + user + ":" + password  + "@" + host + ":" + port + "/" + dbname;

    var client = new pg.Client(conString);
    client.connect();
}

//Set time zone for timestamps to 'America/New_York'
client.query("SET TIME ZONE 'America/New_York';");
//initlize monthly newsletter subscription table if it does not exist
client.query("CREATE TABLE IF NOT EXISTS newsletter(subscription_date timestamp default current_timestamp,email varchar(255));");

var number = 2;
var app = express.createServer(express.logger());

app.use(express.bodyParser());
app.use(express.static(process.env.PWD + '/'));

app.get('/', function(request, response) {
  var fs = require("fs");
  var buffer = new Buffer(fs.readFileSync("index.html"));
  var indexStr = buffer.toString("utf-8",0,buffer.length);
  response.send(indexStr);
});

app.post('/new_newsletter_subscriber', function(req, res) {
    console.log(req.body.name);
    var sqlQuery = util.format("INSERT INTO newsletter(email) values('%s')", req.body.email);
    console.log(sqlQuery);
    client.query(sqlQuery);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
