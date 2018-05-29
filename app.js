// Libraries
const http = require("http")
const express = require('express');
const url = require('url');
const WebSocket = require('ws');
const ForkAPI = require('child_process');

// Constants
const N_CPU = require('os').cpus().length;
const RESOURCE_PATH = '/resources'
// Global variables

// Create first game server

var game_servers = ForkAPI.fork('game_server/server.js');
var available = null;


game_servers.on('message', function(m) {
  // Receive results from child process
  console.log('PLog: ' + m);
});
// Create the app
const app = express();
app.use(express.static('resources'));

app.get('/', function (req, res) {
  res.sendFile('index.html', {"root": __dirname + RESOURCE_PATH});
})

app.get('/requestserver', function(req, res) {
  game_servers.send('available');
  res.send('ws://localhost:8082');
})

app.listen(8080, function () {
  console.log('Listening on 8080');
});

// app.use(express.static('resources'));