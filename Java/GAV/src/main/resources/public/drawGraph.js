
//Establish the WebSocket connection and set up event handlers

//CLIENT SIDE
var webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/public/");
//var webSocket = new WebSocket("ws://graph.alt-wn.com:8080");
webSocket.onmessage = function (msg) { dispose(msg); };
webSocket.onclose = function () { alert("Connection closed") };
var nodesNumber = 0;
var json = [];
var fd;

id("graph_input_text").addEventListener("keypress",function(e) {
   if(e.keyCode == 13) {
   sendMessage(String.fromCharCode(5) + e.target.value);
   nodesNumber = e.target.value;
   id("graph_input_text").style.display = 'none';
   }
});

var rootNode;
id("ready").addEventListener("click", function() {
    sendMessage(String.fromCharCode(6));
    setStartNode();

});

function setStartNode()
{
    var root= document.createElement('span');
    root.className = 'box';
    root.innerHTML = '<input placeholder="Enter start node">';
    start_node.appendChild(root);
    root.addEventListener("keypress", function(e) {
        if(e.keyCode == 13) {
        sendMessage(String.fromCharCode(8) + e.target.value);
        rootNode =  e.target.value;
        console.log(rootNode);
        console.log('test',json[rootNode]);
        root.value = "";
        root.parentNode.removeChild(root);

        console.log(json);
        console.log('rootNode',rootNode);

        json[rootNode].data = {"$color": "#eb5656","$type": "circle"};

        console.log('test2',json[rootNode]);
        fd.loadJSON(json);

        fd.computeIncremental({
           iter: 40,
           property: 'end',
           onStep: function(perc){
             Log.write(perc + '% loaded...');
           },
           onComplete: function(){
             Log.write('Your graph');
             fd.animate({
               modes: ['polar'],
               transition: $jit.Trans.linear,
               duration: 100
             });
           }
         });
        alert(String.fromCharCode(9)+rootNode);
        sendMessage(String.fromCharCode(9)+rootNode);
         return false;
        }
    });
}

function colorNode(node)
{
    json[node].data = {"$color": "#eb5656","$type": "circle"};
    console.log('test2',json[rootNode]);
    fd.loadJSON(json);

    fd.computeIncremental({
       iter: 40,
       property: 'end',
       onStep: function(perc){
         Log.write(perc + '% loaded...');
       },
       onComplete: function(){
         Log.write('Your graph');
         fd.animate({
           modes: ['polar'],
           transition: $jit.Trans.linear,
           duration: 100
         });
       }
     });
}

function dispose(msg) {

    var data = JSON.parse(msg.data);
    var sender = data.sender;
    var message = data.message;

    if(message[0] == 0)
        init();
    if(message[0] == 2)
        colorNode(message.substring(1));
}
function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

//Send a message if it's not empty
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

//------------------------------------------


var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);

})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem)
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
  // init data
  var type = "circle";


  for(var x = 0; x < nodesNumber; x++) {
    json.push({"adjacencies": [],
                "data": {
                  "$color": "#EBB056",
                  "$type": type
                },
                "id": x,
                "name": x
                });
  }

  // init ForceDirected
  fd = new $jit.ForceDirected({
    //id of the visualization container
    injectInto: 'infovis',
    //Enable zooming and panning
    //with scrolling and DnD
    Navigation: {
      enable: true,
      type: 'Native',
      //Enable panning events only if we're dragging the empty
      //canvas (and not a node).
      panning: 'avoid nodes',
      zooming: 20 //zoom speed. higher is more sensible
      //alert(fd.canvas.getPos());
    },
    // Change node and edge styles such as
    // color and width.
    // These properties are also set per node
    // with dollar prefixed data-properties in the
    // JSON structure.
    Node: {
      overridable: true,
      dim: 15 //radius of the circle
    },
    Edge: {
      overridable: true,
      color: '#23A4FF',
      lineWidth: 0.9
    },
    // Add node events
    Events: {
      enable: true,
      type: 'Native',
      //Change cursor style when hovering a node
      onMouseEnter: function() {
        fd.canvas.getElement().style.cursor = 'move';
      },
      onMouseLeave: function() {
        fd.canvas.getElement().style.cursor = '';
      },
      //Update node positions when dragged
      onDragMove: function(node, eventInfo, e) {
        var pos = eventInfo.getPos();
        node.pos.setc(pos.x, pos.y);
        fd.plot();
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      }
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 140,
    // This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      // Create a 'name' and 'close' buttons and add them
      // to the main node label
      var nameContainer = document.createElement('span'),
          closeButton = document.createElement('span'),
          adderEdges = document.createElement('span'),
          style = nameContainer.style;
      nameContainer.className = 'name';
      nameContainer.innerHTML = node.name;
      closeButton.className = 'close';
      adderEdges.className = 'add';
      adderEdges.innerHTML = '+';
      closeButton.innerHTML = 'x';
      domElement.appendChild(nameContainer);
      domElement.appendChild(closeButton);
      domElement.appendChild(adderEdges);
      style.fontSize = "2em";
      style.color = "#ddd";
      //Fade the node and its connections when
      //clicking the close button
      closeButton.onclick = function() {
        node.setData('alpha', 0, 'end');
        node.eachAdjacency(function(adj) {
          adj.setData('alpha', 0, 'end');
        });
        fd.fx.animate({
          modes: ['node-property:alpha',
                  'edge-property:alpha'],
          duration: 500
        });
        sendMessage(String.fromCharCode(4) + node.id);
      };

      adderEdges.onclick = function() {
        var box = document.createElement('span');
        box.className = 'box';
        box.innerHTML = '<input placeholder="To which?">';
        domElement.appendChild(box);

        box.addEventListener("keypress", function(e) {
            if(e.keyCode == 13) {
            sendMessage(String.fromCharCode(3) + node.id +"-"+ e.target.value);
            box.value = "";
            box.parentNode.removeChild(box);

            json[node.name]["adjacencies"].push({
             "nodeTo": e.target.value,
             "nodeFrom": node.id,
             "data": {}
             });

             fd.loadJSON(json);

             // compute positions incrementally and animate.
             fd.computeIncremental({
               iter: 40,
               property: 'end',
               onStep: function(perc){
                 Log.write(perc + '% loaded...');
               },
               onComplete: function(){
                 Log.write('Your graph');
                 fd.animate({
                   modes: ['polar'],
                   transition: $jit.Trans.linear,
                   duration: 100
                 });
               }
             });
             return false;
            }
        });
      };
      id("restart").addEventListener("click", function() {
          sendMessage(String.fromCharCode(7));
          id("graph_input_text").style.display = '';
          fd.canvas.clear();  //to nie działa :(
          fd.Graph.Label.DOM.clearLabels();
          fd.Graph.Util.clean();
          /*node.setData('alpha', 0, 'end');
                  node.eachAdjacency(function(adj) {
                    adj.setData('alpha', 0, 'end');
                  });
                  fd.fx.animate({
                    modes: ['node-property:alpha',
                            'edge-property:alpha'],
                    duration: 500
            */
            fd.graph.eachNode(function(n) {
              delete n;

              n.eachAdjacency(function(adj) {
                delete adj;
              });
             });


      });

      //Toggle a node selection when clicking
      //its name. This is done by animating some
      //node styles like its dimension and the color
      //and lineWidth of its adjacencies.
      nameContainer.onclick = function() {
        //set final styles
        fd.graph.eachNode(function(n) {
          if(n.id != node.id) delete n.selected;
          n.setData('dim', 7, 'end');
          n.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 0.4,
              color: '#23a4ff'
            });
          });
        });
        if(!node.selected) {
          node.selected = true;
          node.setData('dim', 17, 'end');
          node.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 3,
              color: '#36acfb'
            });
          });
        } else {
          delete node.selected;
        }
        //trigger animation to final styles
        fd.fx.animate({
          modes: ['node-property:dim',
                  'edge-property:lineWidth:color'],
          duration: 500
        });
        // Build the right column relations list.
        // This is done by traversing the clicked node connections.
        var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
            list = [];
        node.eachAdjacency(function(adj){
          if(adj.getData('alpha')) list.push(adj.nodeTo.name);
        });
        //append connections information
        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      };
    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });

  fd.loadJSON(json);
    fd.canvas.scale(0.8,0.8);
  // compute positions incrementally and animate.
  fd.computeIncremental({
    iter: 40,
    property: 'end',
    onStep: function(perc){
      Log.write(perc + '% loaded...');
    },
    onComplete: function(){
      Log.write('Your graph');

      fd.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 2500
      });
    }
  });
}