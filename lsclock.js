'use strict';

var
  fs = require('fs'),
  express = require('express'),
  app = express(),
  server = require('http').createServer(app), // create webserver
  net = require('net');

var config = {
  unixSocket: __dirname + '/lsclock.sock'
};

app.use(express.static(__dirname + '/static'));

app.get('/getDate', function (req, res) {
  var now = Date.now();
  res.set('Content-Type', 'application/json');
  res.json(now);
});

app.get('/', function (req, res) {
  if (req.acceptsLanguage('fr')) {
    res.sendfile('static/home.fr.html');
  } else {
    res.sendfile('static/home.html');
  }
});

server.on('error', function (e) {
  if (e.code === 'EADDRINUSE') {
    var clientSocket = new net.Socket();
    clientSocket.on('error', function (e) { // handle error trying to talk to server
      if (e.code === 'ECONNREFUSED') { // No other server listening
        fs.unlinkSync(config.unixSocket);
        server.listen(config.unixSocket, function () { //'listening' listener
          console.log('server recovered');
        });
      }
    });
    clientSocket.connect({
      path: config.unixSocket
    }, function () {
      console.log('Server running, giving up...');
      process.exit();
    });
  }
});

server.listen(config.unixSocket);