const process = require("process");
const WebSocket = require('ws');
const players = require("./ship.js");
const Universe = require("./solarSystem.js");
const MersenneTwister = require('./mersenne-twister.js');
const planet = require("./planet.js");


const wss = new WebSocket.Server({ port: 8082 });
const marsenne_seed = 42;


var universe = new Universe();

generate_universe();

function generate_universe () {
  var randomizer = new MersenneTwister(marsenne_seed);
  universe.generate(randomizer);
}

console.log("Spawned server 8082");

process.on('message', (m, socket) => {
  console.log("GLog: " + m);
  if (m === 'available') {
    process.send('192.168.0.1:8082');
  }
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    
    // Send JSON to client with current instance statuss
    ws.send('GAMESERVER ponging urself');
  });

  ws.send("Started connection with GAMESERVER");
});