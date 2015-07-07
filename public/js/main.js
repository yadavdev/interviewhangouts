$(function(){ 

  //Initialise codemirror with options
  editor = CodeMirror.fromTextArea(document.getElementById("editor-area"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    mode: "text/x-c++src"
  });
  
  //Initionalize view on load. 
  $("#calling-peer").hide();
  $("#end-call").hide();
  $("#reconnect-peer").hide();
  $('#nameModal').modal('show');
  $('#nameModal').on('shown.bs.modal', function() {
        $(this).find('[autofocus]').focus();
  });
  $(".code_output").val("#Output will be displayed here.#");
  $(".code_output").prop('disabled', true);
  $('.selectpicker').selectpicker({
          style: 'btn-default btn-sm'
      });       


  
  // Adjust Height of window depending on viewport height.
  
  var req_height= $(window).height() - $(".page-header").outerHeight(true);

  $(".user_box").css('height',req_height-3);
  $(".CodeMirror").css('height',req_height-60);
  $(".CodeMirror").css('border',"1px solid darkgrey");
  $(".CodeMirror-gutters").css('height',req_height-60);
  $("#video-container").css('height',req_height-23);
  
  $('.choosemode').click(function(){
    
    $('.presentationmode').toggle();
    $('.editormode').toggle();

    if($('.choosemode').val()==="presentation"){
      $('.editorpanelbuttons').hide();
      $('.choosemode').val('codeeditor');
      $('.choosemode').html('<span class="glyphicon glyphicon-chevron-left"></span> Back to Code Editor');
    }
    else{
      $('.stoppresentation').hide();
      $('.editorpanelbuttons:not(.selectpicker)').show();
      $('.choosemode').val('presentation');
      $('.choosemode').html('Switch to Presentation Mode<span class="glyphicon glyphicon-chevron-right"></span>');

    }
  });
  
  $('.createpresentation').click(function(){
    var doc_id = $('.docslink').val();
    doc_id = doc_id.replace('pub','embed');
    $('.stoppresentation').show();
    $('.presentationarea').hide();
    $('.presentationmode').append('<div class="presentationframe"><iframe width="960" height="749" class="myframe" frameborder="0" style="width:100%" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" src="'+doc_id+'"></div>');
    $('.myframe').css('height',req_height-60);
  });
  $('.stoppresentation').click(function(){
        $('.presentationframe').remove();
        $('.presentationarea').show();
        $('.stoppresentation').hide();
    });
  
  
  
  /*
  ##################################################################################################
    Different Event Handlers Code.
  */

  //Change code language. Import syntax highlighting code.
  $( ".editor_language" ).change(function() {
    switch ($(".editor_language").val()) {
      case "cpp":
        $.getScript("./js/mode/clike.js", function(){
          editor.setOption("mode","text/x-c++src");
        });
        break;
      case "c#":
        $.getScript("./js/mode/clike.js", function(){
          editor.setOption("mode","text/x-objectivec");
        });
        break;
      case "c":
        $.getScript("./js/mode/clike.js", function(){
          editor.setOption("mode","text/x-csrc");
        });
        break;
      case "java":
        $.getScript("./js/mode/clike.js", function(){
          editor.setOption("mode","text/x-java");
        });
        break;
      case "haskell":
        $.getScript("./js/mode/haskell.js", function(){
          editor.setOption("mode","haskell");
        });
        break;
      case "scala":
        $.getScript("./js/mode/clike.js", function(){
          editor.setOption("mode","text/x-scala");
        });
        break;
      case  "html mixed":
        $.getScript("./js/mode/xml.js", function(){ });
        $.getScript("./js/mode/javascript.js", function(){});
        $.getScript("./js/mode/css.js", function(){});
        $.getScript("./js/mode/vbscript.js", function(){});
        $.getScript("./js/mode/htmlmixed.js", function(){});
        var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
               mode: null},
              {matches: /(text|application)\/(x-)?vb(a|script)/i,
               mode: "vbscript"}]
        };
        editor.setOption("mode",mixedMode);
        break;
      case "php":
        $.getScript("./js/mode/htmlmixed.js", function(){ });
        $.getScript("./js/mode/xml.js", function(){ });
        $.getScript("./js/mode/javascript.js", function(){ });
        $.getScript("./js/mode/css.js", function(){ });
        $.getScript("./js/mode/clike.js", function(){ });
        $.getScript("./js/mode/php.js", function(){
          editor.setOption("mode", "application/x-httpd-php");
          editor.setOption("indentUnit", 4);
          editor.setOption("indentWithTabs", true);
        });
      case "python":
        $.getScript("./js/mode/python.js", function(){
          editor.setOption("mode", "python");
        });
      case  "ruby":
        $.getScript("./js/mode/ruby.js", function(){
          editor.setOption("mode","text/x-ruby");
        });
      case  "javascript":
        $.getScript("./js/mode/javascript.js", function(){
          editor.setOption("mode","javascript");
        });
    }
  });
  
  $( ".editor_keymap" ).change(function() {
    switch ($(".editor_keymap").val()) {
      
      case "sublime":
        $.getScript("./js/mode/sublime.js", function(){
          editor.setOption("keyMap","sublime");
        });
        break;
      
      case "emacs":
        $.getScript("./js/mode/emacs.js", function(){
        editor.setOption("keyMap","emacs");
        });
        break;
    
      case "vim":
        $.getScript("./js/mode/vim.js", function(){
        editor.setOption("keyMap","vim");
    });
    }

  });

  //Chage in editor font
  
  $(".fontsizeup").click(function() {
    var fontSize = parseInt($(".CodeMirror").css("font-size"));
    fontSize = fontSize + 1 + "px";
    $(".CodeMirror").css("font-size",fontSize);
  });
  $(".fontsizedown").click(function() {
    var fontSize = parseInt($(".CodeMirror").css("font-size"));
    fontSize = (fontSize - 1) + "px";
    $(".CodeMirror").css("font-size",fontSize);
  });

  //Editor Code Submit
  $(".code_submit").on("click",function(){
    
    $('.code_submit').buttonLoader('start');
    $(".code_output").prop('disabled', true);
    $(".code_input").prop('disabled', true);
    
    try{
      socket.emit('test_code',{'src':editor.getValue(), 'inp': $(".code_input").val(), 'lang':$(".editor_language option:selected").attr("data-langid")}); 
    }
    catch(err){
      alert("An error Occurred:\n" + err.message + "\nPlease reload page or try again.");
      $('.code_submit').buttonLoader('stop');
      $(".code_output").prop('disabled', false);
      $(".code_input").prop('disabled', false);
    }
  });

  //Handler for window resizing
  $( window ).resize(function() {
    
    var req_height= $(window).height() - $(".page-header").outerHeight(true);
    
    $(".user_box").css('height',req_height);
    $(".CodeMirror").css('height',req_height-60);
    $(".CodeMirror").css('border',"1px solid darkgrey");
    $(".CodeMirror-gutters").css('height',req_height-60);
    $("#video-container").css('height',req_height-20);
    $(".myframe").css('height',req_height-60);
  });

  // Handler for chat send on pressing enter key.

  $('#chatarea').keypress(function(e) {
    if (e.keyCode == 13 && !e.shiftKey && document.getElementById('chatarea').value !=="") {
      
      e.preventDefault();
      //Broadcast Chat to socket's room.
      socket.emit('chatmsg', document.getElementById('chatarea').value); 
      
      var d = new Date;
      var chatmsg ='<li class="clearfix"><div class="chat-body clearfix" style="font-size:13px"><div class="header clearfix"><strong class="pull-right primary-font">'+user+'</strong></div><p class="text-left">'+document.getElementById('chatarea').value+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
      
      $(".chat").append(chatmsg);
      $('#chatarea').val('');

      //Auto Scroll to latest message.
      var scrolltoh = $('.panel-body')[0].scrollHeight;
      $('.panel-body').scrollTop(scrolltoh);
    }
  });

  // End video call button

  $('#end-call').click(function(){
    window.existingCall.close();
    $("#end-call").hide();
  });

  //Enter room on name submit

  $(".EnterRoom").click(function(){
    
    user = $(".username").val();
    user = user.trim();
    user = user.replace(/\s\s+/g, ' ');
    
    //Validiate name removing extra spaces and check for length and special characters.
    if(user!="" && !(/[^A-Za-z0-9 ]/.test(user)) && user.length>3){ 
      $("#nameModal").modal('hide');
      $(".user_span").html("<h5 class='h5' style='color:white'>Hello <b><u>" + user + "</u></b></h4>" );
      socket.emit('addToRoom',{'room':myroom, 'user':user});
      $("#roompath").val(window.location);
      step1();
    }
    else
      alert("1. Name should contain alphanumeric characters.\n 2. Length should be minimum 4 characters.");
  });

  //On keyup send editor content to other users
  editor.on("keyup", function(){
    socket.emit('Edit_Request',editor.getValue());
  });

var textarea = $('#chatarea');
var typingStatus = $('.typingstatus');
var lastTypedTime = new Date(0); //lastTypedTime it's 01/01/1970, actually some time in the past
var typingDelayMillis = 1000; // typingDelayMillis how long user can "think about his spelling" before we show "No one is typing -blank space." message

function refreshTypingStatus() {
    if (!textarea.is(':focus') || textarea.val() == '' || new Date().getTime() - lastTypedTime.getTime() > typingDelayMillis) {
    } else {
        socket.emit('usertyping',user);
    }
}
function updateLastTypedTime() {
    lastTypedTime = new Date();
}

setInterval(refreshTypingStatus, 100);
textarea.keypress(updateLastTypedTime);
textarea.blur(refreshTypingStatus);




});    


//###############################################################################################################

/* 
Functions and socket.io event handlers
*/

//global socket object
socket = io();

//global users_online array
user_online_array = "";

//current user
user="";

//user's socket.io server side socket.id to be used as peerjs video chat id
my_socket_id ="";

//Compatiability Shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//Number of users online in current room
var num_users =0;
var usertypingtimer = null;
//Room id from the url                
myroom = window.location.pathname;
myroom = myroom.slice(1);

/*
  Socket.io custom event handlers
*/

//Send current user details to the server when requested
socket.on("giveuser",function(msg){
  if(user!="" && myroom!="")
    socket.emit('addToRoom',{'room':myroom, 'user':user});
});

//Receive socket.id of the user
socket.on('socket_id', function(id){
  //Remove special characters from the socket id
  my_socket_id=(id).replace(/[^a-z0-9]/gi,'');
  
  //Initialise peerjs video chat client with socket.io server id.
  peer = new Peer(my_socket_id, {host: 'interviewhangouts.herokuapp.com', port:80, path: '/api'});//new Peer({ key: 'mil0ydkxb2qbmx6r', debug: 3});

  //Do nothing on connection from peerjs
  peer.on('open', function(){
  });

  /*
    Create peerjs Event Handlers.

  */

  // Receiving a call
  peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      //alert("call recieving");
      call.answer(window.localStream);
      step3(call);
  });

  //Handle Error event in Peerjs
  peer.on('error', function(err){
      //If connection to server is lost try reconnecting in all other cases reloading page only option.
      if(err.message == 'Lost connection to server.'){
        var reconnectpeerserver = (function() { setTimeout(function(){
                                                  if(peer.disconnected)
                                                    peer.reconnect();
                                                  else reconnectpeerserver();
          }, 50); })();
       }
      else{
          $("#freeow").freeow("error type: "+err.type +"\n PeerJs Error Occured:",err.message + "\nPlease Reload the page." , {
            classes: ["smokey", "pushpin"],
            autoHide: false
          });
      }
  });

});


//Receive Editor content from other users in the room.
socket.on("Edit_Response", function(msg){
  editor.setValue(msg);
});

socket.on("usertyping", function(typinguser){
   $('.typingstatus').html(typinguser+' is typing...');   

   if (usertypingtimer) {
    clearTimeout(usertypingtimer); //cancel the previous timer.
    usertypingtimer = null;
    }
  usertypingtimer = setTimeout(function(){
    $('.typingstatus').html('');
    }, 1000);
   
    
});


//Receive Chat messges from other users in the room.
socket.on('chatmsg', function(msg){
  var d = new Date;
  clearTimeout(usertypingtimer); //cancel the previous timer.
  usertypingtimer = null;
  $('.typingstatus').html('');
  var chatmsg ='<li class="clearfix"><div class="chat-body clearfix" style="font-size:13px"><div class="header clearfix"><strong class="primary-font pull-left" >'+msg.user+'</strong></div><p class="text-left">'+msg.msg+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
  $(".chat").append(chatmsg);
  var scrolltoh = $('.panel-body')[0].scrollHeight;
  $('.panel-body').scrollTop(scrolltoh);
  var audio = document.getElementById('sound_chat');
  audio.play();
});

//Receive info of other users connecting in the room
socket.on('user_connect', function(users_array){
  
  $(".user_list").empty();
  
  user_online_array = users_array;
  num_users=user_online_array.length -1;
  
  if(num_users ===0)
    $(".user_list").html("0 person online in this room");
  
  for(var i=0; i<users_array.length;i++){
    if(users_array[i][0] !== user)
      $(".user_list").append('<div class="btn-group pull-right rm_'+users_array[i][0]+'_div " style="padding: 5px 5px 5px 5px;width:100%"><button type="button" class="btn btn-default dropdown-toggle btn-block" data-toggle="dropdown"><i class="fa fa-circle pull-left" style="color:green;"></i> '+users_array[i][0]+' <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a class="btn btn-success btn-link " onclick="get_Peer_Id(this);" id="'+users_array[i][0]+'">Start Video-Call </a></li></ul></div>');
  }
});

//Receive info of other user disconnecting.
socket.on('user_disconnect', function(disconnected_user){
   //remove the disconnected user
  $('.rm_'+disconnected_user+'_div').remove();
   
  num_users--;
  if(num_users === 0){
    $(".user_list").empty();
    $(".user_list").html("0 person online in this room");
  }
});

//Receive Code testing result from server.
socket.on("result", function(msg){
  $('.code_submit').buttonLoader('stop');
  $(".code_output").prop('disabled', false);
  $(".code_input").prop('disabled', false);
  try{
    var out= "Compilation Msg#:\n" +msg.result.compilemessage + "\nTime#:\n" + msg.result.time+"\n#Output#:\n" + msg.result.stdout;
    $(".code_output").val(out);
  }
  catch(err){
    //alert("Server side error.\nPlease retry or reload the page.\n Error:\n"+ err.message +"\nNote: There is a problem with 'scanf' function in c/c++.\n If you are using it please use cin instead for now." );
  }
}); 

//##############################################################################################
/*
  Video chat functions
*/

// Click handlers setup
function step1 () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
    $('#my-video').prop('src', URL.createObjectURL(stream));
    step2();
    window.localStream = stream;
  }, function(){ 
      $("#freeow").freeow("WebCam Error.", "Failed to access the webcam and microphone. Please reload the page and click allow when asked for permission by the browser.", {
        classes: ["smokey", "warning"],
        autoHide: false
      });
 });
}

function step2 () {
  $("#freeow").freeow("Video Chat", "To start a video chat click on person's name and select video chat.", {
    classes: ["smokey", "pushpin"],
    autoHide: true,
    autoHideDelay:3000
    });
}

function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
    $("#end-call").hide();
  }

  // Wait for stream on the call, then set peer video display
  
  call.on('stream', function(stream){
      $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  $("#calling-peer").hide();
  
  // UI stuff
  window.existingCall = call;
  $("#end-call").show();

  call.on('close', function(){
    $("#freeow").freeow("Video Chat", "Call Disconnected. Text Chat is always active", {
      classes: ["smokey", "pushpin"],
      autoHide: true,
      autoHideDelay:5000
      });
    $("#end-call").hide();
  });
}

function vidfunctn() {
  var myvideosmall = document.getElementById("my-video");
  var myvideolarge = document.getElementById("my-video-large");
  myvideolarge.src = myvideosmall.src;
  myvideolarge.autoplay = true;

  var theirvideosmall = document.getElementById("their-video");
  var theirvideolarge = document.getElementById("their-video-large");
  theirvideolarge.src = theirvideosmall.src;
  theirvideolarge.autoplay = true;
}

function get_Peer_Id(peer_name){
  var id_found=-1;
  for(var i=0; i<user_online_array.length;i++){
    if(user_online_array[i][0] === peer_name.id){
      id_found=i;
      break;                 
    }
  }
  $("#calling-peer").show();
  
  var call = peer.call(user_online_array[id_found][1].replace(/[^a-z0-9]/gi,''), window.localStream);
  step3(call);
}