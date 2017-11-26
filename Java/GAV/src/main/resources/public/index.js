//Establish the WebSocket connection and set up event handlers

//CLIENT SIDE
var webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/public/");
//var webSocket = new WebSocket("ws://graph.alt-wn.com:8080");
webSocket.onmessage = function (msg) { dispose(msg); };
webSocket.onclose = function () { alert("Connection closed") };
webSocket.onopen = function () { alert("Connection open") };

var nodesNumber = 0;
var algorithm = 0;
var json = [];
var fd;

id("BFS").addEventListener("click", function () {
   algorithm = 1;
   webSocket.send(String.fromCharCode(1));
 });

id("DFS").addEventListener("click", function () {
   algorithm = 2;
   webSocket.send(String.fromCharCode(2));
 });

var rootNode;

function dispose(msg) {

    var data = JSON.parse(msg.data);
    var sender = data.sender;
    var message = data.message;
}

function sendMessage(message) {
    if (message !== "") {
        webSocket.send(message);
    }
}

//Helper functions for inserting HTML as the first child of an element
function insert(targetId, message) {
    id(targetId).insertAdjacentHTML("beforeend", message);
}

//Helper function for selecting element by id
function id(id) {
    return document.getElementById(id);
}
