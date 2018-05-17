const process = require("process");
const WebSocket = require('ws');
const pPlayer = require("./ship.js");
const Universe = require("./solarSystem.js");
const MersenneTwister = require('./mersenne-twister.js');
const planet = require("./planet.js");


const wss = new WebSocket.Server({ port: 8082 });
const marsenne_seed = 42;


var the_whole_universe_was_in_a_hot_dense_state = new Universe();
var players = [];

generate_universe();

function generate_universe () {
  var randomizer = new MersenneTwister(marsenne_seed);
  the_whole_universe_was_in_a_hot_dense_state.generate(randomizer);
}

console.log("Spawned server 8082");

// IPC between master HTTP server and this instance
process.on('message', (m, socket) => {
  if (m === 'available') {
    process.send('192.168.0.1:8082');
  }
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // If message is type get_name then attach the given name to socket
    
    // Send JSON to client with current instance status
    ws.send('GAMESERVER ponging urself');
  });


  // TODO: New connection
  // create new player and put it on array
  // Send all necessary info to this player
  ws.send("Started connection with GAMESERVER");
});

// TODO: broadcast after 33.3ms
// JSON with server update