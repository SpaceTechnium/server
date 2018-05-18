const fs = require('fs');
const process = require("process");
const WebSocket = require('ws');
const Player = require("./player.js");
const Universe = require("./solarSystem.js");
const MersenneTwister = require('./mersenne-twister.js');


const wss = new WebSocket.Server({ port: 8082 });
const marsenne_seed = 42;
const PLANET_BOUND_BOX_FACTOR = 1.2; 


var the_whole_universe_was_in_a_hot_dense_state = new Universe();
var players = [];
var planet = [];

generate_universe();

function generate_universe () {
  var randomizer = new MersenneTwister(marsenne_seed);
  the_whole_universe_was_in_a_hot_dense_state.generate(randomizer);
  the_whole_universe_was_in_a_hot_dense_state.spawn(randomizer);
}

function collision_json () {
  if (planet.length < 1) {
    for (system of the_whole_universe_was_in_a_hot_dense_state.solarSystems) {
      // Put sun
      planet.push({
        pos_x: system.pos.x,
        pos_y: system.pos.y,
        pos_z: system.pos.z,
        radis: system.sunRadius,
        boundbox: system.sunRadius*PLANET_BOUND_BOX_FACTOR
      })
      // Put each planet
      for (p of system.arrayPlanets) {
        planet.push({
          pos_x: p.pos.x,
          pos_y: p.pos.y,
          pos_z: p.pos.z,
          radis: p.radius,
          boundbox: p.radius*PLANET_BOUND_BOX_FACTOR
        })
      }
    }
  }

  return JSON.stringify({
      planets: planet
  });
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
      // Send if it's okay or not
    // Else it's an update message with pos, rot of player
    // Find player
    // Update
  });


  // TODO: New connection
  // create new player and put it on array
  // Send all necessary info to this player
  ws.send("Started connection with GAMESERVER");
});

// TODO: broadcast after 33.3ms
// JSON with server update
// Updates player, bullets and ranking and send time T to each player