var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//For creating Post requests 
var unirest = require('unirest');

//uncomment below line to use custom peerjs server
//Peer Server Object
//var ExpressPeerServer = require('peer').ExpressPeerServer;

//uncomment below lines to use custom peerjs server.
//var options = {
//    debug: true
//}

//Enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

//Store user data in variable room
var rooms = [];

//uncomment below line to use custom peer server
//Initialise peer server
//app.use('/api', ExpressPeerServer(http, options));


app.use(express.static(__dirname + '/public/'));

//Get Room id from url
app.get('/:roomName', function(req, res){
  
  activeChat = req.params.roomName;
  res.sendFile(__dirname +'/public/chat.html');

});
app.get('/:roomName/', function(req, res){
  
  activeChat = req.params.roomName;
  res.sendFile(__dirname +'/public/chat.html');

});
//Socket.io on connection event

io.on('connection', function(socket){
    /*Check if the socket was already connected previously
      .user .room custom properties are added to the on connection. 
      In cases when server fails and restarts 
    */

  if(socket.user === undefined || socket.room === undefined)
    io.to(socket.id).emit("giveuser");

  //User disconnect event listener.
  socket.on('disconnect', function(){
    /*  Code:
            Remove user from socket.
            Search user in it's room and remove it from user array of the room.
            If room is empty, remove the room.
    */
    socket.leave(socket.room);
    var user_idx = -1;
    
    //Check if user room is lost. Common cause: Server restart. 
    if(rooms[socket.room] != undefined){
      for(var i=0;i<rooms[socket.room].user_array.length;i++){
        if(rooms[socket.room].user_array[i][0] === socket.user){
          //Find user in user array. O(length)
          user_idx = i;
          break;
        }
      }

      //Remove user from user_array.
      rooms[socket.room].user_array.splice(user_idx,1);

      if(rooms[socket.room].user_array.length === 0){
        delete rooms[socket.room];
      }

      //Update people online for other users.
      io.sockets.in(socket.room).emit('user_disconnect', socket.user);

      console.log(socket.user+" disconnected.");
    }
    else 
      console.log("Probable Server Restart. Disconnecting user to reconnect. user: %s room: %s",socket.user,socket.room);

  });

  socket.on('addToRoom', function (roomName){
    /*  Code:
            Add user to room.
            Add custom property .user .room to socket for later identification.
            Search if room exists. Add user.
    */

    socket.room = roomName.room;
    socket.user = roomName.user;
    
    var flag = 0; //NOTE: No race conditions observed now
    
    for( var key in rooms ) {
      if( key === socket.room ){
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

    //Add socket to provided room
    socket.join(socket.room);

    //Send user_connect msg to other users in room.
    io.sockets.in(socket.room).emit('user_connect', rooms[socket.room].user_array);

    //Send the current user it's server socket.id to use as peerjs id. Ensures uniqueness on custom server.
    io.to(socket.id).emit('socket_id',socket.id);
   
    console.log(socket.user+" connected.");
    });
  
  //Broadcast users chat message to its room.
  socket.on('chatmsg', function(msg){
    socket.broadcast.to(socket.room).emit('chatmsg',{"user":socket.user,"msg":msg});
  });

  socket.on('usertyping', function(user){
    socket.broadcast.to(socket.room).emit('usertyping',user);
  });

  //Recieve text user is writing in editor broadcast to other users.
  socket.on('Edit_Request', function(msg){
    socket.broadcast.to(socket.room).emit('Edit_Response', msg);
  });

  //load presentation
  socket.on('presentation', function(link){
    if(link.command==='start'){
      if(link.site===1)
        socket.broadcast.to(socket.room).emit('presentation',{'site':link.site,'command':link.command,'link':link.link, 'presenter':socket.user});
   
      else if(link.site===2){
              unirest.get("http://www.slideshare.net/api/oembed/2?url="+link.link+"&format=json")
                    .header("Accept", "json")
              .end(function (result) {
                  if(result.status===200){
                    io.sockets.in(socket.room).emit('presentation',{'site':link.site,'command':link.command,'link':result.body.html.match(/.*\/key\/([0-9a-zA-Z]*).*/)[1], 'presenter':socket.user});
                  }
                  else{
                    io.to(socket.id).emit('server_msg',{'code':result.status,'site':link.site});
                  }
              });

          }
          else if(link.site==0){
                  unirest.get(link.link)
                    .header("Accept", "text/html")
              .end(function (result) {
                  if(result.status===200){
                    io.sockets.in(socket.room).emit('presentation',{'site':link.site,'command':link.command,'link':link.link, 'presenter':socket.user});
                  }
                  else{
                      io.to(socket.id).emit('server_msg',{'code':result.status,'site':link.site});
                  }
              });
          }
      }
      else socket.broadcast.to(socket.room).emit('presentation',{'site':link.site,'command':link.command,'link':link.link, 'presenter':socket.user});
   
     });
  /*
      Receive code running request.
      Send data to hackerrank api using unirest.
      Send result to all users.
  */
  socket.on('test_code', function(msg){
    unirest.post("https://api.hackerrank.com/checker/submission.json")
          .strictSSL(false)
          .header("Content-Type", "application/x-www-form-urlencoded")
          .header("Accept", "application/json")
          .send("format=json")
          .send("lang="+ msg.lang)
          .send("source=" + encodeURIComponent(msg.src))
          .send('testcases=["'+ msg.inp +'"]')
          .send("wait=true")

          //Get your own api_key registering at hackerrank.com
          .send("api_key=")
          .end(function (result) {
            io.sockets.in(socket.room).emit("result",result.body);
          });

    });
});

http.listen( (process.env.PORT || 5000), function(){
  console.log('Server running');
});
