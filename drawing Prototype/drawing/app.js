var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 3000
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(3000);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:3000");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/templates/drawboard_index.html');
});


// array of all lines drawn
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history 
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });


    // add handler for message type "draw_line".
   socket.on('draw_canvas', function (data) {
     console.log("test");
   });

});
