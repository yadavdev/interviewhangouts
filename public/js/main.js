$(function(){ //Initialise codemirror with options
     people_online =0;
     editor = CodeMirror.fromTextArea(document.getElementById("editor-area"), {
        lineNumbers: true,
        //theme:"ambiance",
        styleActiveLine: true,
        matchBrackets: true,
        mode: "text/x-c++src"
    });
     $('#nameModal').modal('show'); 
     $("#calling-peer").hide();
     $("#end-call").hide();
     $("#reconnect-peer").hide();
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
     
    editor.on("keyup", function(){
            socket.emit('Edit_Request',editor.getValue());
      });  
    $(".code_output").val("#Output will be displayed here.#");
    $(".code_output").prop('disabled', true);
    req_height= $(window).height() - $(".page-header").outerHeight(true);
     // //alert(req_height);
      $(".user_box").css('height',req_height);
      $(".CodeMirror").css('height',req_height-30);
      $(".CodeMirror").css('border',"1px solid darkgrey");
      $(".CodeMirror-gutters").css('height',req_height-30);
      $("#video-container").css('height',req_height-20);
      $(".user_list").html("<div style='color:white'>0 person online in this room</div>");
          var myroom = window.location.pathname;
              myroom = myroom.slice(1);

    $( ".editor_language" ).change(function() {
            if($(".editor_language").val() == "cpp"){
               $.getScript("./js/mode/clike.js", function(){
                                 editor.setOption("mode","text/x-c++src");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "c#"){
               $.getScript("./js/mode/clike.js", function(){
                                editor.setOption("mode","text/x-objectivec");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "c"){
               $.getScript("./js/mode/clike.js", function(){
                         editor.setOption("mode","text/x-csrc");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "java"){
               $.getScript("./js/mode/clike.js", function(){
                                 editor.setOption("mode","text/x-java");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "haskell"){
               $.getScript("./js/mode/haskell.js", function(){
                                 editor.setOption("mode","haskell");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "scala"){
               $.getScript("./js/mode/clike.js", function(){
                                editor.setOption("mode","text/x-scala");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "html mixed"){
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
                               // alert("Script loaded and executed.");
            }
            else if($(".editor_language").val() == "php"){
                $.getScript("./js/mode/htmlmixed.js", function(){ });
                $.getScript("./js/mode/xml.js", function(){ });
                $.getScript("./js/mode/javascript.js", function(){ });
                $.getScript("./js/mode/css.js", function(){ });
                $.getScript("./js/mode/clike.js", function(){ });
                $.getScript("./js/mode/php.js", function(){
                                editor.setOption("mode", "application/x-httpd-php");
                                editor.setOption("indentUnit", 4);
                                editor.setOption("indentWithTabs", true);
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "python"){
               $.getScript("./js/mode/python.js", function(){
                                editor.setOption("mode", "python");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "ruby"){
               $.getScript("./js/mode/ruby.js", function(){
                                editor.setOption("mode","text/x-ruby");
                                //alert("Script loaded and executed.");
                });
            }
            else if($(".editor_language").val() == "javascript"){
               $.getScript("./js/mode/javascript.js", function(){
                               editor.setOption("mode","javascript");
                                //alert("Script loaded and executed.");
                });
            }
        }); 

     $( ".editor_keymap" ).change(function() {
            if($(".editor_keymap").val() == "sublime"){
               $.getScript("./js/mode/sublime.js", function(){
                               editor.setOption("keyMap","sublime");
                                //alert("Script loaded and executed.");
                });
            } else  if($(".editor_keymap").val() == "vim"){
               $.getScript("./js/mode/vim.js", function(){
                               editor.setOption("keyMap","vim");
                                //alert("Script loaded and executed.");
                });
            } else  if($(".editor_keymap").val() == "emacs"){
               $.getScript("./js/mode/emacs.js", function(){
                               editor.setOption("keyMap","emacs");
                                //alert("Script loaded and executed.");
                });
            }
        


     });

      $( ".editor_font" ).change(function() {
                $(".CodeMirror").css("font-size",$(".editor_font").val() +"px");

      });

      $(".code_submit").on("click",function(){
               $('.code_submit').buttonLoader('start');
               $(".code_output").prop('disabled', true);
               $(".code_input").prop('disabled', true);
                
                try{
                
                    socket.emit('test_code',{'src':editor.getValue(), 'inp': $(".code_input").val(), 'lang':$(".editor_language option:selected").attr("data-langid")}); 
                //TODO Problem with c code on server side.                    
                    }
                catch(err){ alert("An error Occurred:\n" + err.message + "\nPlease reload page or try again.");

                            $('.code_submit').buttonLoader('stop');
                            $(".code_output").prop('disabled', false);
                            $(".code_input").prop('disabled', false); 
    
                    }

            });
     
      $( window ).resize(function() {
              var req_height= $(window).height() - $(".page-header").outerHeight(true);
              $(".user_box").css('height',req_height);
              $(".CodeMirror").css('height',req_height-30);
              $(".CodeMirror").css('border',"1px solid darkgrey");
              $(".CodeMirror-gutters").css('height',req_height-30);
              $("#video-container").css('height',req_height-20);    
             // alert("height changed");


        });

     $('#chatarea').keypress(function(e) {
        if (e.keyCode == 13 && !e.shiftKey && document.getElementById('chatarea').value !=="") {
        e.preventDefault();
        socket.emit('chatmsg', document.getElementById('chatarea').value); 
        var d = new Date;
        var chatmsg ='<li class="clearfix"><div class="chat-body clearfix" style="font-size:13px"><div class="header clearfix"><strong class="pull-right primary-font">'+user+'</strong></div><p class="text-left">'+document.getElementById('chatarea').value+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
        $(".chat").append(chatmsg);
        document.getElementById('chatarea').value='';
        var scrolltoh = $('.panel-body')[0].scrollHeight;
                    $('.panel-body').scrollTop(scrolltoh);

        }
    });

    $('#end-call').click(function(){
        window.existingCall.close();
        $("#end-call").hide();
      });

   $('#reconnect-peer').click(function(){
        peer.reconnect();
        $("#reconnect-peer").hide();
      });
   $(".EnterRoom").click(function(){
        user = $(".username").val();
        if(user!="" && !(/[^A-Za-z0-9 ]/.test(user))){ 
            $("#nameModal").modal('hide');
            
            $(".user_span").html("<h5 class='h5' style='color:white'>Hello <b><u>" + user + "</u></b></h4>" );
            socket.emit('addToRoom',{'room':myroom, 'user':user});
            $("#roompath").val(window.location);
            step1();
      }
      else{
        alert("Name should contain only alphanumeric characters.");
        
      }


   });


});    
    socket = io();
    
    user_online_array = "";
      user="demouser";
    //user = prompt("Please Enter Your Name","");

    my_socket_id ="";

    //while (user == ""){
      //  user = prompt("Please Enter Your Name","");
    //}
    var num_users =0;

    socket.on('socket_id', function(id){
            my_socket_id=(id.myid).replace(/[^a-z0-9]/gi,'');
           // alert(id.port);
                  peer = new Peer(my_socket_id, {host: 'interviewhangouts.herokuapp.com', port:80, path: '/api'});//new Peer({ key: 'mil0ydkxb2qbmx6r', debug: 3});

            peer.on('open', function(){
                //alert("peer object created: "+peer.id+"\n socket.id:"+my_socket_id);
               // alert("connected to server!");
               $("#freeow").freeow("connected to server.","All modules enabled." , {
                    classes: ["smokey", "pushpin"],
                    autoHide: true,
                    autoHideDelay:2000
                    });
            });

            // Receiving a call
            peer.on('call', function(call){
                // Answer the call automatically (instead of prompting user) for demo purposes
                //alert("call recieving");
                call.answer(window.localStream);
                step3(call);
            });
            peer.on('error', function(err){
                $("#freeow").freeow("PeerJs Error Occured:",err.message + "\nPlease Reload the page." , {
                    classes: ["smokey", "pushpin"],
                    autoHide: true,
                    autoHideDelay:5000
                    });
                if(err.message == 'Lost connection to server.'){
                  alert("Error detected: try-reconnect or reload.");
                  $("#reconnect-peer").show();

                }

            });

        });

  
      
     
    socket.on("Edit_Response", function(msg){

                  editor.setValue(msg);
      });

    socket.on('chatmsg', function(msg){
        var d = new Date;
        var chatmsg ='<li class="clearfix"><div class="chat-body clearfix"><div class="header clearfix"><strong class="primary-font pull-left" style="font-size:13px">'+msg.user+'</strong></div><p class="text-left">'+msg.msg+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
        $(".chat").append(chatmsg);

          var scrolltoh = $('.panel-body')[0].scrollHeight;
                    $('.panel-body').scrollTop(scrolltoh);
          var audio = document.getElementById('sound_chat');
              audio.play();   
            

        });

    socket.on('usr_connect', function(users_array){
            $(".user_list").empty();
            user_online_array = users_array;
            num_users=user_online_array.length -1;
            if(num_users ===0)
                $(".user_list").html("0 person online in this room");
            for(var i=0; i<users_array.length;i++){
                    if(users_array[i][0] !== user){
                    //remote_peer_id = remote_usr.peer_id;
                    $(".user_list").append('<div class="btn-group pull-right rm_'+users_array[i][0]+'_div " style="padding: 5px 5px 5px 5px;width:100%"><button type="button" class="btn btn-default dropdown-toggle btn-block" data-toggle="dropdown"><i class="fa fa-circle pull-left" style="color:green;"></i> '+users_array[i][0]+' <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a class="btn btn-success btn-link " onclick="get_Peer_Id(this);" id="'+users_array[i][0]+'">Start Video-Call </a></li></ul></div>');
                    }
            }
        });
    socket.on('usr_disconnect', function(disconnected_user){
             $('.rm_'+disconnected_user+'_div').remove();
             num_users--;
             if(num_users === 0){
                $(".user_list").empty();
                $(".user_list").html("0 person online in this room");
            }

        });
    
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


// Compatibility shim


// PeerJS object

// Click handlers setup
function step1 () {
    // Get audio/video stream
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));
        step2();
        window.localStream = stream;
    }, function(){ $("#freeow").freeow("WebCam Error.", "Failed to access the webcam and microphone. Please reload the page and click allow when asked for permission by the browser.", {
                    classes: ["smokey", "warning"],
                    autoHide: false
                    });
 });
}

function step2 () {
    $("#freeow").freeow("Video Chat", "The text Chat is already active. To start a video chat click on person's name and select video chat.", {
                    classes: ["smokey", "pushpin"],
                    autoHide: true,
                    autoHideDelay:5000
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
    //alert(peer_name.id);
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
