// Libraries
const http = require("http")
const express = require('express');
const url = require('url');
const WebSocket = require('ws');
const ForkAPI = require('child_process');

// Constants
const numCPUs = require('os').cpus().length;

// Global variables

// Create first game server
var game_servers = ForkAPI.fork('game_server/server.js');

// Create the app
const app = express();

app.get('/', function (req, res) {
  res.sendFile('test.html', {"root": __dirname});
})

app.get('/requestserver', function(req, res) {
  res.send('ws://localhost:8082')
})

app.listen(8080, function () {
  console.log('Listening on 8080');
});