// ** Globals

var curLevel=0
var playerLife = 10
var monNum = undefined
var gameEnded = false
var animOn = false 
var then = -1, prevSnd=0  

var player
var backgroundSp
var monsters  
var greenMonsters  
var bombas  
var averageFPS = 60.0 

//-- sprite sheet divisions
	const txPos=[
	    [0,0,0.25,0.25],
		[0.25,0,0.5,0.25],
		[0,0.25,0.25,0.499955],
		[0.5001,0,1,0.5],
		[0.25,0.25,0.5,0.49995],
		[0.25,0.5,0.5,0.75]
	]	
	
// ** Init Globals
function initData(){
	if(musicHappy){
		musicHappy.pause()
		musicHappy.fastSeek(0) 
	}
	if(musicSad)
	{
		musicSad.pause()
		musicSad.fastSeek(0) 
	}
	var things=levels[curLevel]
	initWorld(6,6)	
	
	gameEnded = false
	playerLife = 10
	results1.innerHTML="";
	then=-1
	monNum = undefined
	 monsters = []
	 greenMonsters = []
	 bombas = []	
	 CollisionBlocks =[]
	
	//-- create player sprite
	player = new Sprite(  things.player.x,things.player.y,
		            things.player.w*2,things.player.h,
					txPos[4] 
				  )
				  
	//-- load bombas from thing
	for(let k=0;k<things.bombas.length;k++){
		let bom =  
	      new Sprite(
		      things.bombas[k].x,
			  things.bombas[k].y,
		      things.bombas[k].w*2,
			  things.bombas[k].h*2,
			  txPos[1]
			  )
		bom.frq=rnd(1,2)
		bombas.push(bom)
	} 
	//add some bombas for experiments
	{
		let bom =  
	      new Sprite(
		      0,-2.6,
			  0.2,
			  0.2,
			  txPos[1]
			  )
		bom.frq=rnd(1,2)
		bombas.push(bom)
	} 
	//-- load monsters from thing
	for(let k=0;k<things.monsters.length;k++){
		let mon =  
	      new Sprite(
		      things.monsters[k].x,
			  things.monsters[k].y,
		      things.monsters[k].w*2,
			  things.monsters[k].h*2,
			  txPos[0]
			  )
		mon.frq=rnd(1,2)
		monsters.push(mon)
	}
	
	//-- load green monsters
	for(let k=0;k<things.greenMonsters.length;k++){
		let mon =  new Sprite(
				  things.greenMonsters[k].x,
				  things.greenMonsters[k].y,
				  things.greenMonsters[k].w*2,
				  things.greenMonsters[k].h*2,
				  txPos[2]
			  )
		mon.frq=rnd(1,2)
		greenMonsters.push(mon)
	}
	
	//-- background	sprite
		backgroundSp = new Sprite(0,0,
					World.hWidth*2,
					World.hHeight*2,
					[1.5,0.5,1.75,0.75])
		backgroundSp.color=[0.1,0.2,0.8,1.0]
		backgroundSp.th = 0
	
	//-- create collision blocks
	for(let k=0;k<things.boxes.length;k++){
		let p = 
	      new Sprite(
		      things.boxes[k].x,
			  things.boxes[k].y,
		      things.boxes[k].w*2,
			  things.boxes[k].h*2,
			  [2.5,0.5,2.75,0.75]
			  )
		 
		p.color=[1,1,1,1]
		p.th=0
		CollisionBlocks.push( p )
	}
}
	
//------------------------------------------------
function drawScene (){
	  
	  if(!animOn)return
	  
	  if(then<0){
		  then=performance.now()
		  
		  requestAnimationFrame(drawScene)
		  return
	  }
	  let time = performance.now()

	  //-- detect failure
	  if(playerLife<=0){
		const p = new Sprite(0,-0.3+0.01*Math.sin(time*0.00690),1.8,1.8*16.0/9.0,[0.5,0,1,0.5])
		 if(!gameEnded){
			 gameEnded = true
			 if(musicSad) musicSad.play()
		 }
		Camera.x=0
		Camera.y=0
		p.th=0
		let sclx =1.1+0.1*Math.sin(time*0.0050)
		addSpriteToBuf(p,sclx,1.0/sclx,sclx*0.1)
		drawAll()
		results.innerHTML=""
		results1.innerHTML="Monsters are having a nice meal now!<br>You are the meal!!<br>Double click here to restart game"
		showElement(trackers)
		requestAnimationFrame(drawScene)
		return
	  }
	  //-- detect success ---
	  if((monNum!=undefined)&&monNum<=0){
		const p = new Sprite(0,-0.3+0.01*Math.sin(time*0.00690),2,32.0/9.0,[0.75,0.5,1,0.75])
		 if(!gameEnded){
			 gameEnded = true
			 curLevel++
		     curLevel%=levels.length
			 if(musicHappy) musicHappy.play()
		 }
		Camera.x=0
		Camera.y=0
		p.th=0
		let sclx =1.1+0.1*Math.sin(time*0.0050)
		addSpriteToBuf(p,sclx,1.0/sclx,sclx*0.1)
		drawAll()
		results.innerHTML=""
		results1.innerHTML="Congratulations!!<br>"
		if(curLevel>0)
			results1.innerHTML+="Double click here to go to next level."
		else
			results1.innerHTML+=" You fried all monsters !<br>You are considered a hero by all sea creatures.<br>Double click here to restart game"
		showElement(trackers)
		requestAnimationFrame(drawScene)
		return
	  }
	  
	  
	  const dt = 0.001*(time-then)
	  
	  if(dt<1.0/120.0){
			requestAnimationFrame(drawScene)		  
		return
	  }
	  
	  then=time;
	     
		
		updateCamera(player)
		setUnif('X',Camera.x)
		setUnif('Y',Camera.y)
		setUnif('tm',time/1000.0)
			
		
		
		//-- enque background to drawing 
		addSpriteToBuf(backgroundSp)
		
		//-- enque walls to drawing 
		addSprites(CollisionBlocks) 
		
	  //-- update Monsters ---
	  monNum=0
		for(let k=0;k<monsters.length;k++)
		{
			let mon = monsters[k]
			
			if(mon.state==='dead')continue
			monNum++
			
			//-- detect bombas 
			for(let i=0;i<bombas.length;i++)
				if(bombas[i].distTo(mon)<bombas[i].w*2)
				{
					mon.state='dead'
					playSnd(sndBom[rndInt(0,sndBom.length)])
					startSpark(mon,bombas[i])
					startExplosion(mon)
					break
				}
				
			let r =  0.1+0.01*k
			if(rndDecide(0.3))
			{ 
				let rn =rnd(0.4,1.6)
				let d = mon.distTo(player)
				mon.ax = rn*(player.x-mon.x)*dt*32/(0.01+d)
				mon.ay = rn*(player.y-mon.y)*dt*32/(0.01+d)
			}
			 
			 
			mon.vx+=mon.ax*dt
			mon.vy+=mon.ay*dt
			let sx = mon.x+ mon.vx*dt
			let sy = mon.y+ mon.vy*dt
			mon.checkCollision(sx,sy)
				 
			
			mon.vx*=0.993/(1+0.01*mon.speed())
			mon.vy*=0.993/(1+0.01*mon.speed())
			 
			const rr =  1.0+0.023*Math.sin(mon.frq*time*0.008)
			let sclx = rr
			let scly =1.0/rr 
			mon.th+=dt*rnd(0.9,1.6)
			
			if( intersectRects(mon,player) )
			{
				if(time>prevSnd+100){
					playSnd(snd)
					playerLife--
					prevSnd=time
				}
					
			}
			addSpriteToBuf(mon,sclx,scly)
		}
		//-- update bombas
		for(let k=0;k<bombas.length;k++){
			let bom = bombas[k]
			const rr =  1.0+0.063*Math.sin(bom.frq*time*0.008)
			let sclx = rr
			let scly =1.0/rr 
			addSpriteToBuf(bom,sclx,scly)
		}
		
		//-- update green Monsters ---
		for(let k=0;k<greenMonsters.length;k++)
		{
			let mon = greenMonsters[k]
			
			if(mon.state==='dead')continue
			monNum++
			
			//-- detect bombas 
			for(let i=0;i<bombas.length;i++)
				if(bombas[i].distTo(mon)<bombas[i].w*2)
				{
					mon.state='dead'
					playSnd(sndBom[rndInt(0,sndBom.length)])
					startSpark(mon,bombas[i])
					startExplosion(mon)
					break
				}
				
			let r =  0.1+0.01*k
			if(rndDecide(0.3))
			{ 
				let rn =rnd(0.4,1.6)
				let d = mon.distTo(player)
				mon.ax= rn*(player.x-mon.x)*dt*32/(0.01+d)
				mon.ay= rn*(player.y-mon.y)*dt*32/(0.01+d)
			}
			 
			 
			mon.vx+=mon.ax*dt
			mon.vy+=mon.ay*dt
			
			let sx = mon.x+ mon.vx*dt
			let sy = mon.y+ mon.vy*dt
			mon.checkCollision(sx,sy)
				 
			mon.vx*=0.993/(1+0.01*mon.speed())
			mon.vy*=0.993/(1+0.01*mon.speed())
			 
				
			const rr =  1.0+0.063*Math.sin(mon.frq*time*0.008)
			let sclx = rr
			let scly =1.0/rr 
			mon.th+=dt*rnd(0.9,1.6)
			
			if( intersectRects(mon,player) )
			{
				if(time>prevSnd+100){
					playSnd(snd)
					playerLife--
					prevSnd=time
				}
					
			}
			addSpriteToBuf(mon,sclx,scly)
		}
		
		//-- update player 
		if(Mouse.btn>0){
			player.vx  =  5* (  Mouse.x-player.x  )
			player.vy  =   5* (  Mouse.y-player.y  )
			Mouse.btn -=  0.2*dt
		} 
		 if(Key.pressed()){
			 Mouse.btn =0
			 player.vx   =  10* (Key.right-Key.left) 
			 player.vy   =  10* (Key.up-Key.down) 
		 }
		const maxV = 3.0
		let v = player.speed()
			
			if(v>maxV){
				v=maxV/v
				player.vx *=v
				player.vy *=v
			}
		const gv = Math.exp(-5*dt)
		player.vx  *= gv 
		 player.vy  *= gv
		
		player.th =  Math.PI+ Math.atan2(player.vy,player.vx)  
			
			player.flipH(player.vx)
			 
			let newx = player.x +  dt * player.vx
			let newy = player.y +  dt * player.vy
			
			player.checkCollision(newx,newy)
			 
			
			const th = time * 0.009
			const tt = 1.0+0.2*Math.sin(th )
			addSpriteToBuf(player,tt,1/tt,0)
			
		//-- explosions
		updateSparks()
		explosionsUpdate(dt)	
        
		
		
		
			
		averageFPS = 0.9*averageFPS +0.1/dt
		
        //-- stats --
        if(animOn){ 
		 
			results.innerHTML ="fps:"+Math.round(averageFPS)
			    +"<br>sprites:"+vNum/6
				+"<br>level:"+(curLevel+1)
				+"<br>life:"+playerLife
				+"<br>monsters:"+monNum
				+"<br>[p] or [2fingers]:pause/resume<br>[t] or [3fingers]:hide/show text"
				 
            requestAnimationFrame(drawScene);
        }else results.innerHTML="Click To Start";
		
		//-- send queue to webgl --
			drawAll()
}

function startAnim(){
	animOn=true
	then=-1
	requestAnimationFrame(drawScene)
}

function pauseAnim(){
	animOn=false
	then=-1
}

function togleAnim(){
	if(animOn)pauseAnim()
	else startAnim()
}

//--- main entry 
document.body.onload = function(){
	let waitmessage = document.getElementById('waitmessage')
	document.body.removeChild(waitmessage)
	trackers.onclick="";
	trackers.onclick=undefined
	initGL()
	newTex(image);
	initData() 
    startAnim() 
}
