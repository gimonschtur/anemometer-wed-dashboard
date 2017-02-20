var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db1 = mongojs('anemodata', ['anemodata']);
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var myutil = require('./public/dist/js/bputils.js');

var postFile = 'logs/test-POST.csv';
var getFile = 'logs/test-GET.csv';
var lastTime = 0;


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/windspeed', function (req, res) {
	console.log("Received a GET request for /windspeed");

	db1.anemodata.find(function (err, docs) {
		res.json(docs);
	});
});


app.post('/windspeed', function(req, res) {
	req.body.timeStamp = new Date();
	console.log(req.body);
	db1.anemodata.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});


app.delete('/windspeed/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	db1.anemodata.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

app.get('/windspeed/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	db1.anemodata.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
		console.log("Response from query");
		console.log(doc);
	});
});

app.put('/windspeed/:id', function (req, res) {
	var id = req.params.id;
	console.log(req.body.id);
	db1.anemodata.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {pstatus: req.body.pstatus, powindicator: req.body.powindicator}},
		new: true}, function (err, doc) {
			console.log(doc);
			res.json(doc);
	});
});

app.post('/incoming', function(req, res) {
	var timeDiff = 0;
	req.body.timeStamp = new Date();
	console.log("Received a POST request from user-" + req.body.id + " to /incoming");
	db1.anemodata.findAndModify({query: {id: req.body.id},
		update: {$set: {windSpeed: req.body.windSpeed, timeStamp: req.body.timeStamp, RSSI: req.body.RSSI, battLevel: req.body.battLevel, battVoltage: req.body.battVoltage}},
		new: true}, function (err, doc) {
			console.log(req.body);
			timeDiff = doc.timeStamp.getTime() - lastTime;
			lastTime = doc.timeStamp.getTime();
			myutil.timeLogs(postFile, doc.timeStamp.toLocaleString(), timeDiff, doc.id, doc.windSpeed, doc.RSSI, doc.battLevel, doc.battVoltage);
			// if (doc.pstatus == "OFF") {
			// 	res.send("$");
			// } else { 
			// 	res.send("%");
			// }
	});
	io.emit('new bpEntry', req.body);
});

app.get('/windspeedRequest/:id', function(req,res) {
	var id = req.params.id;
	console.log("Received a GET request from user-" + id);
	db1.anemodata.findOne({id: id}, function (err, docs) {
		myutil.timeLogs(getFile, doc.timeStamp, "", doc.id, doc.windSpeed);
		if (docs.pstatus == "OFF") {
			res.send("$");
		} else {
			res.send("%");
		}
	});
});


io.on('connection', function(socket) {
	console.log('a user connected');
});

http.listen(3000);
console.log("Server running on port 3000");