"use strict";
const execFile = require('child_process').execFile
const fs = require("fs");
const testing = require("./testclass.js");
/*var jsony = require("./handshake.json");*/

/*var array = [];
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
console.log(stringToSend); //Object.keys(jsony2) */

/*var child = execFile("octree/standalone/build/Release/octree",
  function (error, stdout, stderr) {
    // This callback is invoked once the child terminates
    // You'd want to check err/stderr as well!
    var response_json = JSON.parse(stdout);
    console.log("Here is the complete output of the program: \n");
    console.log(stdout+"\n\n");
    var yolo = 0;
    response_json.collisions.forEach(function(data, index) {
        //console.log(index + " " + data);
        var player = data["player"];
        var object = data["object"];
        console.log(player.name + " " + object.uuid + " " + yolo++);
    });
});*/



var testing2 = new testing();
testing2.generate();
var x, c;
console.log(testing2);
for (x of testing2.testArray)
{  
    if(x.value == 2)
        c = x;
}
c.value = 0;
console.log(testing2);


