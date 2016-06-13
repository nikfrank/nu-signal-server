var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('disconnect', function(socket){
  console.log('a user disconnected');
});





http.listen(8500, function(){
  console.log('listening on *:8500');
});
