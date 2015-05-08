'use strict';

var
  fs = require('fs'),
  express = require('express'),
  app = express(),
  server = require('http').createServer(app), // create webserver
  net = require('net');

app.use(express.static(__dirname + '/static'));

app.get('/getDate', function (req, res) {
  var now = Date.now();
  res.set('Content-Type', 'application/json');
  res.json(now);
});

app.get('/', function (req, res) {
  if (req.acceptsLanguage('fr')) {
    res.sendfile(__dirname + '/static/home.fr.html');
  } else {
    res.sendfile(__dirname + '/static/home.html');
  }
});

server.listen(3000);
