
var nav_height;
var chat_open = false;
$(document).ready(
	function() {
		nav_height = $('nav').outerHeight();
		$(".canvas-wrapper").css("height","calc(100% - " + nav_height + "px)");
		$(".chat-for-real").css("height", "calc(100% - " + nav_height + "px)");

		$(".chat-button").click(function(){
			if(!chat_open){
				$(".hidden-chat-div").css("min-width","250px");	
				$(".chat-for-real").css("width", "250px");
				chat_open = true;
			}
		});
		$("#close-chat").click(function() {
			$(".hidden-chat-div").css("min-width","0px");
			$(".chat-for-real").css("width", "0px");
			chat_open = false;
		});

		$(".glyphicon-floppy-save").click(function() {
			var canvas  = document.getElementById('canvas');
			var dataURL = canvas.toDataURL('image/png');
    		window.location.href = dataURL;
		});
	}
);

document.addEventListener("DOMContentLoaded", function() {
   var mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('canvas');
   var context = canvas.getContext('2d');
   var socket  = io.connect();
   $("#color-select").val('#000000')

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop; 

      mouse.pos.x = x;//e.clientX;
      mouse.pos.y = y;//e.clientY;
      mouse.move = true;
   };

   // draw line received from server
	socket.on('draw_line', function (data) {
      var line = data.line;
      
      context.beginPath();
      //old
      //context.moveTo(line[0].x, line[0].y);
      //context.lineTo(line[1].x, line[1].y);
      //context.strokeStyle = line[2];
      //context.lineWidth = line[3];

      //testing
      console.log(line[2] + "   "  + line[3]);
      context.arc(line[1].x, line[1].y, line[3], 0, 2 * Math.PI, false);
      context.fillStyle = ''+line[2];
      context.strokeStyle = line[2];
      context.fill();
      //end testing

      context.stroke();
   });
   
   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server

         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, $("#color-select").val(), $("#size-select").val() ] });
         //too slow!
         //socket.emit('draw_canvas', {canvas: context.getImageData(0,0,canvas.width,canvas.height)});
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 10);
   }
   mainLoop();
});
