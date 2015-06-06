var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public/'));

app.get('/:roomName', function(req, res){
  console.log(req.params.roomName);
  activeChat=req.params.roomName;
  res.sendFile(__dirname +'/public/index.html');
});

io.on('connection', function(socket){
   console.log('a user connected');
  
   socket.on('disconnect', function(){
      console.log('user disconnectedfrom room: %s' , socket.room);
      socket.leave(socket.room);
    });

    socket.on('addToRoom', function (roomName){
      socket.room = roomName.room;
      socket.user = roomName.user;
      console.log("user %s added to room %s", socket.user,roomName.room);
      socket.join(socket.room);
    });

    socket.on('chatmsg', function(msg){
      socket.broadcast.to(socket.room).emit('chatmsg', msg);
      console.log('%s: user %s says, %s', socket.room,socket.user, msg);
   });

    socket.on('Edit_Request', function(msg){
      console.log('Editor request recieved');
      socket.broadcast.to(socket.room).emit('Edit_Response', msg);
      console.log('Response Sent');
    });

});

http.listen((process.env.PORT || 8000), function(){
  console.log('listening on port: %s', 8000);
});
