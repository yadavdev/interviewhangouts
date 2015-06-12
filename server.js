var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var unirest = require('unirest');
var ExpressPeerServer = require('peer').ExpressPeerServer;
var options = {
    debug: true
}

app.use('/api', ExpressPeerServer(http, options));

var rooms=[];

app.use(express.static(__dirname + '/public/'));

app.get('/:roomName', function(req, res){
  activeChat=req.params.roomName;
  res.sendFile(__dirname +'/public/index.html');
});


io.on('connection', function(socket){
    //console.log('a user connected');
    socket.on('disconnect', function(){
      socket.leave(socket.room);
       var user_idx = -1;
      if(rooms[socket.room] != undefined){
          console.log("undefined");
      for(var i=0;i<rooms[socket.room].user_array.length;i++){

        if(rooms[socket.room].user_array[i][0] === socket.user){
            user_idx = i;
            break;
          }
      }

      rooms[socket.room].user_array.splice(user_idx,1);
      console.log(rooms[socket.room].user_array);

      if(rooms[socket.room].user_array.length === 0){
        delete rooms[socket.room];
      }
      io.sockets.in(socket.room).emit('usr_disconnect', socket.user);
      console.log(socket.user+" Disconnected.");
    }
    else console.log("undefined");

    });

    socket.on('addToRoom', function (roomName){
      socket.room = roomName.room;
      socket.user = roomName.user;
      if(socket.room == ""){
        socket.room = "defaultroom";
        //console.log("added to dafultroom");
      }
      var flag=0; //NOTE: No raising race condition now
      for( var key in rooms ) {
        if( key === socket.room ){
            //console.log("Room Exists: "); 
            //console.log(rooms[key]);
            flag=1;
            break;
        }
      }
      
      if(flag === 0){
        rooms[socket.room] = {
              name:socket.room,
              user_array:[]
        }
        rooms[socket.room].user_array.push([socket.user,socket.id]);
      }
      else{
        rooms[socket.room].user_array.push([socket.user,socket.id]);
      }
        socket.join(socket.room);
        io.sockets.in(socket.room).emit('usr_connect', rooms[socket.room].user_array);
        io.to(socket.id).emit('socket_id',socket.id);
        console.log(socket.user+" connected.");
      });

    socket.on('chatmsg', function(msg){
      socket.broadcast.to(socket.room).emit('chatmsg',{"user":socket.user,"msg":msg});
      //console.log('%s: user %s says, %s', socket.room,socket.user, msg);
   });
/*
    socket.on('getPeerId', function(parameter){

      socket.broadcast.to(socket.room).emit('peer_id_requested',{"user":parameter.user,"from":socket.id});
      //console.log('%s: user %s says, %s', socket.room,socket.user, msg);
   });

  socket.on('TakePeerId', function(parameter){

      io.to(parameter.to).emit('id_received',parameter.id);
      console.log('id received emmited');
   });*/
 
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
          .send("source=" + encodeURIComponent(msg.src))
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