$(function(){	

	var roomid="";

	$(".createNewRoom").click(function () {
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for( var i=0; i < 10; i++ )
        	roomid += possible.charAt(Math.floor(Math.random() * possible.length));    	
	
		window.location.href = window.location  +roomid;
	});

	$(".RoomUrl").click(function() {
      
      	roomid = $(".copyroomurl").val();
      
      	roomid = roomid.slice(-10);
      
      	if(/[^a-zA-Z0-9]/.test( roomid ))
      		alert("Please enter a valid link or 10 character long roomid.\n Eg.Fcer9vtsre");
      	
      	else
			window.location.href = window.location +roomid;
      
    });
});