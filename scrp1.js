// JavaScript Document
//--- modified
onmousemove = draw;     
    function draw(e) {
      var canvas = document.getElementById("canvas");
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        var i=Math.floor(Math.random()*255);
        
        ctx.fillStyle = "rgb(200,0,0)";
       var x;
var y;
if (e.pageX || e.pageY) { 
  x = e.pageX;
  y = e.pageY;
}
else { 
  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
} 
x -= canvas.offsetLeft;
y -= canvas.offsetTop; 
        

        //
        ctx.fillRect (0,0, 300,300);
        ctx.fillStyle = "rgb(0, 0, 200)";
        
          ctx.fillRect (x,y,60,50);
          ctx.fillStyle = "rgb(0, 200, 200)";
          ctx.fillRect ( x,y, 55, 40);
          var path=new Path2D();
        path.moveTo(75,50);
    path.lineTo(100,5);
    path.lineTo(x,y);
    ctx.stroke(path);
    ctx.font = "48px serif";
    ctx.strokeText("hi"+x,x,y);
      }
    }
