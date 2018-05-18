const execFile = require('child_process').execFile
const fs = require("fs");

var jsony = require("./handshake.json");

var array = [];
var data = [];
for (key in jsony)
{
    array = [];
    for(index in jsony[key]["pos"])
    {
        array.push(jsony[key]["pos"][index]);
    }
    data.push(array);
}

jsony2 = jsony;
keys = Object.keys(jsony2);
Object.keys(jsony2).forEach(function(key){
    if(key!="players" && key!="bullets" && key!="planets")
      delete jsony2[key];
  });
//jsony2.push(jsony.);
stringToSend = JSON.stringify(jsony2);
console.log(stringToSend); //Object.keys(jsony2)

var child = execFile("octree/standalone/build/Release/octree",[stringToSend],
  function (error, stdout, stderr) {
    // This callback is invoked once the child terminates
    // You'd want to check err/stderr as well!
    console.log("Here is the complete output of the program: ");
    console.log(stdout)
});