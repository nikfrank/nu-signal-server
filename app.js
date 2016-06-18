var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


let rooms = {};
let offers = {};
let answers = {};

let hosts = {};

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', socket=>
    console.log('a user disconnected'));

  socket.on('create-room', roomSpec=>{
    hosts[roomSpec.name] = {name:roomSpec.name, hostId:socket.id};
    io.sockets.emit('room-list', hosts);
  });

  socket.on('list-rooms', ()=> socket.emit('room-list', hosts));

  socket.on('offer-to-room', ({room, offer, candidate, dcLabel})=>{
    io.to(room.hostId).emit('offer-to-host', {
      room, offer, candidate, patronId:socket.id, dcLabel
    });
  });


  socket.on('answer-to-patron', ({answer, patronId})=>{
    io.to(patronId).emit('answer-to-offerer', answer);
  });
  
  socket.on('icecandidate', data=>{
    if(data.room in rooms) return;

    data.hostId = socket.id;
    rooms[data.room] = data;
    
    console.log(socket.id, data, rooms);
    socket.broadcast.emit('icecandidate', rooms[data.room].candidate);
  });


  socket.on('offer', data=>{
    console.log('offer', socket.id, data);
    if(data.room in offers) return;
      
    else{
      offers[data.room] = data;


      socket.broadcast
      //      io.to(rooms[data.room].hostId)
	.emit('offer', offers[data.room]);
    }
  });

  socket.on('answer', data=>{
    console.log('ans', data);
    if(data.room in answers) return;

    answers[data.room] = data.answer;

    socket.broadcast.emit('answer', answers[data.room]);
  });
});






http.listen(8500, function(){
  console.log('listening on *:8500');
});
