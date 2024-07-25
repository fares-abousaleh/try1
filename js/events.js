//---------------------------------------------
// ** Event Listeners

var Mouse ={
	x:0,y:0,btn:0
}


  
window.addEventListener('mousedown',function(e){
  if(e.button==2)fullScreen()
  if(!animOn){
		
		startAnim()
	}
	
  initAudio()
  
  
    
	Mouse.x= -1+(e.x-can.offsetLeft) * 2.0/can.clientWidth
	Mouse.y=  can.clientHeight* 1.0/can.clientWidth -(e.y-can.offsetTop) * 2.0/can.clientWidth 
	Mouse.x += Camera.x
	Mouse.y += Camera.y
	Mouse.btn  = 1.0
	 
	
  })
 
var Key={
	left:0,
	right:0,
	up:0,
	down:0,
	pressed:function(){
		return Key.up+Key.down+Key.left+Key.right
	},
	
}

window.addEventListener('keydown',
  function(e){
	switch(e.key){
		case 'ArrowLeft':Key.left=1
		break
		case 'ArrowRight':Key.right=1
		break
		case 'ArrowUp':Key.up=1
		break
		case 'ArrowDown':Key.down=1
		break
		case 'p': togleAnim()
		break
		case 't': togleElement(trackers)
		break;
      }
  }
)


window.addEventListener('keyup',
  function(e){
	 
	
	switch(e.key){
		case 'ArrowLeft':Key.left=0
		break
		case 'ArrowRight':Key.right=0
		break
		case 'ArrowUp':Key.up=0
		break
		case 'ArrowDown':Key.down=0
		break
		case '+':monsters=[]
			greenMonsters=[]
		break
		case '-':playerLife=0
		break
      }
  }
)

window.addEventListener('touchstart',
  
  function(e){
	fullScreen( )
	switch(e.touches.length){
		case 2: togleAnim()
		break
		case 3: togleElement(trackers)
		break
	}
  }
 )
 
 results1.addEventListener('dblclick',function(){
	if(gameEnded){
		initData()
		Mouse.btn=0
		startAnim()
	}
 })
 
trackers.oncontextmenu=function(){return false}