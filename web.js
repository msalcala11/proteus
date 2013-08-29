var pg = require('pg');
var fs = require('fs');
var express = require('express');
var util = require('util');
var email   = require("emailjs");

/*
emailServer.send({
   text:    "This is awesome", 
   from:    "you <realcala1@yahoo.com>", 
   to:      "Marty <realcala1@yahoo.com>",
//   cc:      "else <else@gmail.com>",
   subject: "Another test"
}, function(err, message) { console.log(err || message); });

*/

//Postres connection
if(process.env.DATABASE_URL){//we are on heroku
    connectionString = process.env.DATABASE_URL;
    var client = new pg.Client(connectionString);
    client.connect();

    //lets set up our email connection
    var eptokens = process.env.EPASS;
    var eusername = eptokens[0];
    var epassword = eptokens[1];
    var ehost = eptokens[2];
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

    //lets set up our email connection
    var EPASS_FILE = '../.emailpass';
    var eptokens = fs.readFileSync(EPASS_FILE).toString().split(':');
    var eusername = eptokens[0];
    var epassword = eptokens[1];
    var ehost = eptokens[2];

}

var emailServer  = email.server.connect({

    user:     eusername, 
    password: epassword,
    host:     ehost, 
    ssl:      true

});


//Set time zone for timestamps to 'America/New_York'
client.query("SET TIME ZONE 'America/New_York';");
//initlize monthly newsletter subscription table if it does not exist
client.query("CREATE TABLE IF NOT EXISTS newsletter(subscriber_id serial primary key,subscription_date timestamp default current_timestamp,email varchar(255));");

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
    //lets store email in database only if the email does not already exist in database
    var sqlCheckStr = util.format("SELECT COUNT(1) FROM newsletter WHERE email = '%s';", req.body.email);

    var numDuplicates;

    client.query(sqlCheckStr, function(err, result){
	console.log(result.rows[0].count);
	numDuplicates = result.rows[0].count;
	if(numDuplicates === '0'){	    
	    var sqlQuery = util.format("INSERT INTO newsletter(email) values('%s')", req.body.email);
	    console.log(sqlQuery);
	    client.query(sqlQuery);
	    //lets send response back to client
	    res.send("success");
	}
	else{
	    res.send("duplicate_email");
	}
    });
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
