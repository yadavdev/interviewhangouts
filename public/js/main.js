$(function(){ //Initialise codemirror with options
    var editor = CodeMirror.fromTextArea(document.getElementById("editor-area"), {
        lineNumbers: true,
        theme:"ambiance",
        styleActiveLine: true,
        matchBrackets: true
    });

    socket = io();
    var myroom = window.location.pathname;
     user = prompt("Please Enter Your Name","");
    
    while (user == ""){
        user = prompt("Please Enter Your Name","");
    }
    myroom = myroom.slice(1);
      
    socket.emit('addToRoom',{'room':myroom, 'user':user});
      
      editor.on("keyup", function(){
            socket.emit('Edit_Request',editor.getValue());
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

});

/*// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJS object
var peer = new Peer({ key: 'mil0ydkxb2qbmx6r', debug: 3});

peer.on('open', function(){
    $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function(call){
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    step3(call);
});
peer.on('error', function(err){
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
});

// Click handlers setup
$(function(){

    $('#make-call').click(function(){
        // Initiate a call!
        var call = peer.call($('#callto-id').val(), window.localStream);

        step3(call);
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
    step1();
});

function step1 () {
    // Get audio/video stream
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
    }, function(){ $('#step1-error').show(); });
}

function step2 () {
    $('#step1, #step3').hide();
    $('#step2').show();
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
    $('#their-id').text(call.peer);
    call.on('close', step2);
    $('#step1, #step2').hide();
    $('#step3').show();
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
    }*/
function send_chat(){
        socket.emit('chatmsg', document.getElementById('btn-input').value); 
        var d = new Date;
        var chatmsg ='<li class="clearfix"><div class="chat-body clearfix"><div class="header clearfix"><strong class="pull-right primary-font">'+user+'</strong></div><p class="text-left">'+document.getElementById('btn-input').value+'</p><small class="pull-right text-muted timespan"><span class="glyphicon glyphicon-time"> </span>'+ d.getHours()+':'+d.getMinutes() +'</small></div></li>';
        $(".chat").append(chatmsg);
        document.getElementById('btn-input').value='';
        var scrolltoh = $('.panel-body')[0].scrollHeight;
                    $('.panel-body').scrollTop(scrolltoh);

}