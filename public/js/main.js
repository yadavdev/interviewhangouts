$(function(){ //Initialise codemirror with options
     people_online =0;
     editor = CodeMirror.fromTextArea(document.getElementById("editor-area"), {
        lineNumbers: true,
        //theme:"ambiance",
        styleActiveLine: true,
        matchBrackets: true,
        mode: "text/x-c++src"
    });
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      step1();
    editor.on("keyup", function(){
            socket.emit('Edit_Request',editor.getValue());
      });  
    $(".code_output").val("#Output will be displayed here.#");
    $(".code_output").prop('disabled', true);
    req_height= $(window).height() - $(".page-header").outerHeight(true);
     // alert(req_height);
      $(".user_box").css('height',req_height);
      $(".CodeMirror").css('height',req_height-30);
      $(".CodeMirror").css('border',"1px solid darkgrey");
      $(".CodeMirror-gutters").css('height',req_height-30);
      $("#video-container").css('height',req_height-20);
      $(".user_list").html("<div style='color:white'>0 person online in this room</div>");
      $(".user_span").html("<h4 class='h4' style='color:white'>Hello <b><u>" + user + "</u> .</b></h4>" );

          var myroom = window.location.pathname;
              myroom = myroom.slice(1);

         socket.emit('addToRoom',{'room':myroom, 'user':user});
         $("#roompath").val(window.location);



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
        var chatmsg ='<li class="clearfix"><div class="chat-body clearfix" style="font-size:10px"><div class="header clearfix"><strong class="pull-right primary-font">'+user+'</strong></div><p class="text-left">'+document.getElementById('chatarea').value+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
        $(".chat").append(chatmsg);
        document.getElementById('chatarea').value='';
        var scrolltoh = $('.panel-body')[0].scrollHeight;
                    $('.panel-body').scrollTop(scrolltoh);

        }
    });

   

});
    //peer = "";
    
    socket = io();
    
    user_online_array = "";

    user = prompt("Please Enter Your Name","");

    my_socket_id ="";

    while (user == ""){
        user = prompt("Please Enter Your Name","");
    }
    var num_users =0;

    socket.on('socket_id', function(id){
            my_socket_id=id;
          //  alert(my_socket_id);
                  peer = new Peer(my_socket_id, {host: 'localhost', port: 5000, path: '/api'});//new Peer({ key: 'mil0ydkxb2qbmx6r', debug: 3});

            peer.on('open', function(){
                alert("peer object created: "+peer.id+"\n socket.id:"+my_socket_id);
            });

            // Receiving a call
            peer.on('call', function(call){
                // Answer the call automatically (instead of prompting user) for demo purposes
                alert("call recieving");
                call.answer(window.localStream);
                step3(call);
            });
            peer.on('error', function(err){
                alert("error peerjs: "+err.message);
                // Return to step 2 if error occurs
                step2();
            });

        });

  
      
     
    socket.on("Edit_Response", function(msg){

                  editor.setValue(msg);
      });

    socket.on('chatmsg', function(msg){
        var d = new Date;
        var chatmsg ='<li class="clearfix"><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+msg.user+'</strong></div><p class="text-left">'+msg.msg+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
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
                            alert("Server side error.\nPlease retry or reload the page.\n Error:\n"+ err.message +"\nNote: There is a problem with 'scanf' function in c/c++.\n If you are using it please use cin instead for now." );
                         }
                    }); 


// Compatibility shim


// PeerJS object

// Click handlers setup
$(function(){

    $('#make-call').click(function(){
        // Initiate a call!
       
    });

    $('#end-call').click(function(){
        window.existingCall.close();
        step2();
    });

    // Retry if getUserMedia fails
    $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
    });

    // Get things started
    //step1();
});

function step1 () {
    // Get audio/video stream
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        //step2();
    }, function(){ /*$('#step1-error').show();*/ alert("error in step1."); });
}

function step2 () {
   // $('#step1, #step3').hide();
    //$('#step2').show();
}

function step3 (call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    //$('#their-id').text(call.peer);

    call.on('close', step2);
   // $('#step1, #step2').hide();
   // $('#step3').show();
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
    alert(peer_name.id);
    var id_found=-1;
    for(var i=0; i<user_online_array.length;i++){
                    if(user_online_array[i][0] === peer_name.id){
                            id_found=i;
                            break;                 
                    }
            }
     var call = peer.call(user_online_array[id_found][1], window.localStream);

    step3(call);

}
