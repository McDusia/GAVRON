//Establish the WebSocket connection and set up event handlers

//CLIENT SIDE
var webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port+ "/public/");
webSocket.onmessage = function (msg) { paintPage(msg); };
webSocket.onclose = function () { alert("Connection closed") };
var Mode=1;


id("BFS").addEventListener("click", function () {
    screenMode(2);
    webSocket.send(String.fromCharCode(1));
 });

id("DFS").addEventListener("click", function () {
    screenMode(2);
    webSocket.send(String.fromCharCode(2));
 });


id("time").addEventListener("click", function () {
    webSocket.send(String.fromCharCode(3) + "time");
});

id("weekday").addEventListener("click", function () {
    webSocket.send(String.fromCharCode(3) + "weekday");
});

id("weather").addEventListener("click", function () {
    webSocket.send(String.fromCharCode(3) + "weather");
});


function screenMode(mode)
{
    Mode = mode;

    switch(mode){
        case 1:
        id("choosing kind").style.display = '';
        id("chatbot").style.display = '';
        break;
        case 2:
        id("choosing kind").style.display = 'none';
        id("chatbot").style.display = 'none';
    }
}

function paintPage(msg) {

    var data = JSON.parse(msg.data);
    var sender = data.sender;
    var message = data.message;

    switch(Mode){
    case 1:

        updateChatbot(sender,message);
        break;
    case 2:
        break;
    }
}
function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

//Send a message if it's not empty, then clear the input field
function sendMessage(message) {
    if (message !== "") {
        webSocket.send(message);
        id("message").value = "";
    }
}

function updateChatbot(sender,msg) {
    id("responseTime").style.display = 'none';
    id("responseWeekday").style.display = 'none';
    id("responseWeather").style.display = 'none';

    var Id=null;

    switch (sender)
    {
        case "time":
        Id= id("responseTime");
        break;
        case "weekday":
        Id= id("responseWeekday");
        break;
        case "weather":
        Id= id("responseWeather");
        break;
    }
    if (Id!=null)
    {
        Id.style.display = '';
        Id.textContent = msg;
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