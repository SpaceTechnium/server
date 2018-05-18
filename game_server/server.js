const fs = require('fs');
const process = require("process");
const WebSocket = require('ws');
const {Player, Bullet} = require("./player.js");
const Universe = require("./solarSystem.js");
const MersenneTwister = require('./mersenne-twister.js');

const wss = new WebSocket.Server({ port: 8082 });
const marsenne_seed = 42;
const PLANET_BOUND_BOX_FACTOR = 1.2;
var bullet_id = 0;


var playersArray = [];
var bulletsArray = [];
var rankingArray = [];
var tick = 0;
var the_whole_universe_was_in_a_hot_dense_state = new Universe();

generate_universe();

function generate_universe () {
  var randomizer = new MersenneTwister(marsenne_seed);
  the_whole_universe_was_in_a_hot_dense_state.generate(randomizer);
  the_whole_universe_was_in_a_hot_dense_state.spawn(randomizer);
}

function update_universe() {
  tick = performance.now();
  the_whole_universe_was_in_a_hot_dense_state.update(tick);
}

function collision_json () {
  var planet = [];
  // TODO: update planet position
  update_universe();
  for (system of the_whole_universe_was_in_a_hot_dense_state.solarSystems) {
    // Put sun
    planet.push({
      pos_x: system.pos.x,
      pos_y: system.pos.y,
      pos_z: system.pos.z,
      radis: system.sunRadius,
      boundbox: system.sunRadius * PLANET_BOUND_BOX_FACTOR
    })
    // Put each planet
    for (p of system.arrayPlanets) {
      planet.push({
        pos_x: p.pos.x,
        pos_y: p.pos.y,
        pos_z: p.pos.z,
        radis: p.radius,
        boundbox: p.radius * PLANET_BOUND_BOX_FACTOR
      })
    }    
  }

  var collision_json = JSON.stringify({
    planets: planet,
    players: players
  });
  
  var child = execFile("octree/standalone/build/Release/octree",[collision_json],
  function (error, stdout, stderr) {
    // This callback is invoked once the child terminates
    // You'd want to check err/stderr as well!
    var response_json = JSON.parse(stdout);
  });
}

function update_ranking() {
  var rank = playersArray.map(p => {
    var rank = {};
    rank[name] = p.name;
    rank[score] = p.score;
    return rank;
  });
  rankingArray = rank.sort((a, b) => b - a); // sort in descending order
}

// IPC between master HTTP server and this instance
process.on('message', (m, socket) => {
  if (m === 'available') {
    process.send('192.168.0.1:8082');
  }
});


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    var msg = JSON.parse(message);
    // If message is type get_name then attach the given name to socket
    if (msg.type === 'newName') {
      continue;
    }
    
    else if (msg.type === 'newBullet') {
      continue;
    }
    
    // Update message
    else {
      continue;
    }
    ws.send("ARGH matey");
  });
  
  // pretty much, so falta o nome
  var new_player = new Player('Guest', ws);
  new_player.pos_x = 50; // TODO: fix static placement
  new_player.pos_y = 50; // TODO: fix static placement
  new_player.pos_z = 50; // TODO: fix static placement
  playersArray.push(new_player);
  
  ws.send(JSON.stringify({
    type: "handshake",
    tick: tick,
    seed: marsenne_seed,
    players: playersArray,
    bullets: bulletsArray,
    ranking: rankingArray 
  }));
});