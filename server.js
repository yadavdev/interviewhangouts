var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var unirest = require('unirest');
var rooms=[];
var data_room=[];
/*function room() {
  this.name = ""
  this.numusers = 0;
  this.users = [];
}
*/

app.use(express.static(__dirname + '/public/'));

app.get('/:roomName', function(req, res){
 // //console.log(req.params.roomName);
  activeChat=req.params.roomName;
  res.sendFile(__dirname +'/public/index.html');
});


io.on('connection', function(socket){
  // //console.log('a user connected');
     
    socket.on('disconnect', function(){
      socket.leave(socket.room);
     // //console.log(">>>>>>>>>>>>.",socket.room);
      
      var room_idx=rooms.indexOf(socket.room);
     // //console.log("Disconnect:room_idx: %s, num_users_before:%s", room_idx,data_room[room_idx].num_users);
      var user_idx = data_room[room_idx].user_array.indexOf(socket.user);
      
      data_room[room_idx].num_users --;
      ////console.log('Disconnect: room: %s, remaining users: %s' , socket.room, data_room[room_idx].num_users);

      if (user_idx > -1) {
      try{
        var user_removed = data_room[room_idx].user_array.splice(user_idx,1);
        ////console.log("removed %s",user_removed );
      }
      catch(err){
       // //console.log("Error occured: "+ err.message);
      }

      }
      
      if(data_room[room_idx].num_users === 0){
        try{
       // //console.log("Room removed from active rooms: %s", rooms[room_idx]);
        rooms.splice(room_idx,1);
      }
      catch(err){
        ////console.log("Error occured: "+ err.message);
      }

    }

    });

    socket.on('addToRoom', function (roomName){
      socket.room = roomName.room;
      socket.user = roomName.user;
      var room_idx=rooms.indexOf(socket.room);
      if( room_idx === -1){
          rooms.push(socket.room);
          data_room.push({
              name: socket.room,
              num_users: 1,
              user_array:[]
          });
          data_room[data_room.length-1].user_array.push(socket.user);
          //console.log("Created:%s, Num_users:%s",data_room[data_room.length-1].name, data_room[data_room.length-1].num_users, data_room[data_room.length-1].user_array[0]);

      }
      else{
        data_room[room_idx].num_users ++;
        data_room[room_idx].user_array.push(socket.user);
        //console.log("Room exists: %s, Room_idx:%s, User_added: %s, Num_users:%s",data_room[room_idx].name,room_idx, data_room[room_idx].user_array[data_room[room_idx].user_array.length-1],data_room[room_idx].num_users);
      }
      
      socket.join(socket.room);
      //console.log(rooms);
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
          //console.log(msg.src);
           unirest.post("http://api.hackerrank.com/checker/submission.json")
          //.strictSSL(false)
          .header("Content-Type", "application/x-www-form-urlencoded")
          .header("Accept", "application/json")
          .send("format=json")
          .send("lang="+ msg.lang)
          .send("source=" + msg.src)
          .send('testcases=["'+ msg.inp +'"]')
          .send("wait=true")
          .send("api_key=")
          .end(function (result) {
            //console.log(result.body);
            io.sockets.in(socket.room).emit("result",result.body);
          });

      });

});

http.listen((process.env.PORT || 5000), function(){
  //console.log('listening on port: %s', 5000);
});
