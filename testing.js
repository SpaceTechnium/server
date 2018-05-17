const execFile = require('child_process').execFile
const fs = require("fs");

var jsony = require("./pos.json");

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

console.log(data);

var child = execFile("octree/standalone/build/Release/octree",[1],
  function (error, stdout, stderr) {
    // This callback is invoked once the child terminates
    // You'd want to check err/stderr as well!
    console.log("Here is the complete output of the program: ");
    console.log(stdout)
});