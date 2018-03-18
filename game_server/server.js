const process = require("process");
const WebSocket = require('ws');

console.log(`Spawned proccess ` + process.pid);
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('GAMESERVER pong: ' + message);
  });

  ws.send("Started connection with GAMESERVER");
});