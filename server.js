#!/usr/bin/env node
var MongoClient = require('mongodb').MongoClient;

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 8000,
    publicDir = '/public',
    path = require('path');

var router = express.Router();
var exphbs = require("express-handlebars"); app.engine('handlebars', exphbs({defaultLayout: 'main'})); app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

var mongo_pw = process.env.MONGO_PW
var uri = "mongodb://admin:" + mongo_pw + "@ds137220.mlab.com:37220/elephant";

app.get("/", function (req, res) {
	MongoClient.connect(uri, function(err, db) {
		if(err) { return console.dir(err); }
		console.log("Connected to Mongo")
		var collection = db.collection('gps')

		collection.find().sort({ "_id" : -1}).limit(10).toArray(function (err, result) {
	      if (err) {
	        console.log(err);
	      } else if (result.length) {
	        console.log('Found:', result);
			res.render('index', {"coords": result})
	      } else {
	        console.log('No document(s) found!');
	      }
	      //Close connection
	      db.close();
	    });
	});
});


console.log("Simple static server showing listening at %s", port);
app.listen(port);
