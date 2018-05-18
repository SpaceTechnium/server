const fs = require('fs');
const process = require("process");
const WebSocket = require('ws');
const {Vector3, Bullet, Player} = require("./player.js");
const Universe = require("./solarSystem.js");
const MersenneTwister = require('./mersenne-twister.js');

const wss = new WebSocket.Server({ port: 8082 });
const MARSENNE_SEED = 42;
const TICKRATE = 30;
const UPDATE_INTERVAL = 1000 / TICKRATE;
const PLANET_BOUND_BOX_FACTOR = 1.2;

var bullet_id = 0;

var playersArray = [];
var bulletsArray = [];
var rankingArray = [];
var tick = 0;
var the_whole_universe_was_in_a_hot_dense_state = new Universe();

generate_universe();

function generate_universe () {
  var randomizer = new MersenneTwister(MARSENNE_SEED);
  the_whole_universe_was_in_a_hot_dense_state.generate(randomizer);
  the_whole_universe_was_in_a_hot_dense_state.spawn(randomizer);
}

function find_player(websocket) {
  for (player of playersArray) {
    if (player.ws === websocket)
      return player;
  }
  return null;
}

function remove_player (player) {
  var index = playersArray.indexOf(player);
  if (index > -1) {
    playersArray.splice(player, 1);
  }
}

function collision_json () {
  var planet_collision = [];
  var bullet_collision = [];
  var player_collision = [];
  // TODO: update planet_collision position
  update_universe();
  for (system of the_whole_universe_was_in_a_hot_dense_state.solarSystems) {
    // Put sun
    planet_collision.push({
      uniid: system.id,
      pos_x: system.pos.x,
      pos_y: system.pos.y,
      pos_z: system.pos.z,
      radis: system.sunRadius,
      boundbox: system.sunRadius * PLANET_BOUND_BOX_FACTOR
    })
    // Put each planet_collision
    for (p of system.arrayPlanets) {
      planet_collision.push({
        uniid: p.id,
        pos_x: p.pos.x,
        pos_y: p.pos.y,
        pos_z: p.pos.z,
        radis: p.radius,
        boundbox: p.radius * PLANET_BOUND_BOX_FACTOR
      })
    }    
  }

  for (b of bulletsArray) {
    bullet_collision.push({
      pos_x : b.pos.x,
      pos_y : b.pos.y,
      pos_z : b.pos.z,
      boundbox: 0
    });
  }

  for (p of playersArray) {
    player_collision.push({
      name: p.name,
      pos_x: p.pos_x,
      pos_y: p.pos_y,
      pos_z: p.pos_z,
      boundbox: PLAYER_BOUNDING_BOX
    })
  }
  
  var collision_json = JSON.stringify({
    planets: planet_collision,
    bullets: bullet_collision,  
    players: player_collision
  });
  
  var child = execFile("octree/standalone/build/Release/octree",[collision_json],
  function (error, stdout, stderr) {
    // This callback is invoked once the child terminates
    // You'd want to check err/stderr as well!
    var response_json = JSON.parse(stdout);
  });
}

function valid_nickname(nick) {
  if (nick.length > 15)
    return false;
  for (p of playersArray) {
    if (p.name === name)
      return false;
  }
  return true;
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
    if (msg.type === 'nickname') {
      if (valid_nickname(msg.nick)) {
        for (player of playersArray)
          if (player.ws === ws)
            player.name = msg.nick;
      }
      else {
        ws.send(JSON.stringify({
          type: "kick",
          error: "Name is either already present or too long (15 caracters max)"
        }));
        var player = find_player(ws);
        if (player)
          remove_player(player);
        ws.close();
      }
    }

    else if (msg.type === 'newBullet') {
      bulletsArray.push(new Bullet(
        Vector3(msg.pos_x, msg.pos_y, msg.pos_z),
        Vector3(msg.rot_x, msg.rot_y, msg.rot_z)
      ));
    }
    
    else {
      // Received a player update from his position, find him and update
      var player = find_player(ws);
      player.update(new Vector3(msg.pos_x, msg.pos_y, msg.pos_z), new Vector3(msg.rot_x, msg.rot_y, msg.rot_z));
    }
  });
  var new_player = new Player('Guest', ws);


  new_player.pos_x = Math.random() * 1024 - 512;
  new_player.pos_y = Math.random() * 256 - 128; 
  new_player.pos_z = Math.random() * 1024 - 512;
  playersArray.push(new_player);
  
  ws.send(JSON.stringify({
    type: "handshake",
    seed: MARSENNE_SEED,
    pos_x: new_player.pos_x,
    pos_y: new_player.pos_y,
    pos_z: new_player.pos_z
  }));
});


function update_universe() {
  tick = performance.now();
  the_whole_universe_was_in_a_hot_dense_state.update(tick); 
}

function update_bullets() {
  for (bullet of bulletsArray) {
    bullet.update();
  }
}

function update_server() {
  // Update
  update_universe();
  update_bullets();
  // Players are updated by their messages

  ws.send(JSON.stringify({
    type: "update",
    tick: tick,
    players: playersArray,
    bullets: bulletsArray,
    ranking: rankingArray
  }));
}

setInterval(update_server, UPDATE_INTERVAL);