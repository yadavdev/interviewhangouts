var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var unirest = require('unirest');
var rooms={};

app.use(express.static(__dirname + '/public/'));

app.get('/:roomName', function(req, res){
  activeChat=req.params.roomName;
  res.sendFile(__dirname +'/public/index.html');
});


io.on('connection', function(socket){
    console.log('a user connected');
     
    socket.on('disconnect', function(){
      socket.leave(socket.room);


    });

    socket.on('addToRoom', function (roomName){
      socket.room = roomName.room;
      socket.user = roomName.user;

      socket.join(socket.room);
    });

    socket.on('chatmsg', function(msg){
      socket.broadcast.to(socket.room).emit('chatmsg',{"user":socket.user,"msg":msg});
      //console.log('%s: user %s says, %s', socket.room,socket.user, msg);
   });

    socket.on('Edit_Request', function(msg){
      ////console.log('Editor request recieved');
      socket.broadcast.to(socket.room).emit('Edit_Response', msg);
     // //console.log('Response Sent');
    });

    socket.on('test_code', function(msg){
          //console.log("code check request received.")
          //console.log(msg.src +"\n" +msg.lang);
           unirest.post("https://api.hackerrank.com/checker/submission.json")
          .strictSSL(false)
          .header("Content-Type", "application/x-www-form-urlencoded")
          .header("Accept", "application/json")
          .send("format=json")
          .send("lang="+ msg.lang)
          .send("source=" + msg.src)
          .send('testcases=["'+ msg.inp +'"]')
          .send("wait=true")
          .send("api_key=")
          .end(function (result) {
            console.log(result.body);
            io.sockets.in(socket.room).emit("result",result.body);
          });

      });

});

http.listen((process.env.PORT || 5000), function(){
  //console.log('listening on port: %s', 5000);
});
