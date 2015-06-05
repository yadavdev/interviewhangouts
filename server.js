var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public/'));

io.on('connection', function(socket){
   console.log('a user connected');
  
   socket.on('disconnect', function(){
      console.log('user disconnectedfrom room: %s' , socket.room);
      socket.leave(socket.room);
    });

    socket.on('addToRoom', function (roomName){
      socket.room = roomName;
      console.log(socket.room);
      socket.join(roomName);

      console.log('Added to room: %s',roomName);
    });

    socket.on('chatmsg', function(msg){
      socket.broadcast.to(socket.room).emit('chatmsg', msg.msg);
      console.log('%s: %s', socket.room, msg.msg);
   });








http.listen((process.env.PORT || 8000), function(){
  console.log('listening on port: %s', 8000);
});
