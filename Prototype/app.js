var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname + '/views/texteditor.html');
});

var prototype_single_file = "";

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('init', prototype_single_file);
  
  socket.on('textarea update', function(msg){
  	prototype_single_file = msg;
    io.emit('new edit', prototype_single_file);
  });

  socket.on('disconnect', function(msg){
    console.log('a user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});