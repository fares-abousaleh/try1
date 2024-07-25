const MAX_VERTEX_NUM = 10000
var vNum = 0
var ctx ,prog, vbuf, cbuf, tbuf;
const vArr= new Float32Array(MAX_VERTEX_NUM * 2)
const cArr= new Float32Array(MAX_VERTEX_NUM * 4)
const tArr= new Float32Array(MAX_VERTEX_NUM * 2)


 // window.onresize = function(){
	// const w = window.innerWidth
	// const h = window.innerHeight
	// const ratio = 9.0/16.0
	// if(w*ratio<h){
		// can.height = h
		// can.width = h/ratio
	// }else {
		// can.width = w
		// can.height = w*ratio
	// }	
	// ctx.viewport(0,0,can.width,can.height);
		
	// console.log("can: w="+can.width+"  h:"+can.height)
// }
			
	 
	 
	 function setUnif(name,value){
		let loc = ctx.getUniformLocation(prog,name)
		ctx.uniform1f(loc,value)
	 }
	 
	 
	//--------------------------------
	// ** newBuffer: creates a buffer and bind it to attribute 'name'
    function newBuffer(name,size){
		var p = ctx.getAttribLocation(prog,name);
		var buffer = ctx.createBuffer(); 
		ctx.bindBuffer(ctx.ARRAY_BUFFER,buffer); 
		ctx.enableVertexAttribArray(p);
		ctx.vertexAttribPointer(p,size,ctx.FLOAT,false,0,0); 
		return buffer;
	} 	
	
	//---------------------------------
	// ** setBuffer: sets the vbalues in buffer 
    function setBuffer(buffer,values){
		ctx.bindBuffer(ctx.ARRAY_BUFFER,buffer);
		ctx.bufferData(ctx.ARRAY_BUFFER,values,ctx.STATIC_DRAW);
	}
	
	//--------------------------------
	function initGL(){
		
		can.oncontextmenu = function(){return false} 
		ctx = can.getContext("webgl");
        ctx.enable(ctx.BLEND);
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
		console.log(ctx);
		var  VShader = createShader(ctx,ctx.VERTEX_SHADER,vertexShader);
		var  FShader = createShader(ctx,ctx.FRAGMENT_SHADER,fragmentShader);
	    prog = ctx.createProgram();
		ctx.attachShader(prog,VShader);
		ctx.attachShader(prog,FShader);
		ctx.linkProgram(prog);
		var res = ctx.getProgramParameter(prog,ctx.LINK_STATUS);
		if(res)
		    console.log("shaders compiled successfuly.");
		else {
		console.log("error compiling shaders!");
		return;
		}
		//ctx.viewport(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.viewport(0,0,can.width,can.height);
		ctx.useProgram(prog);
		//------- create buffers & texture
	    vbuf = newBuffer("a_Position",2); // 2 coordinates per vertex
	    cbuf = newBuffer("color",4);      // 4 color components per vertex
	    tbuf = newBuffer("texco",2);      // 2 texture coordinates per vertex		
		
	}

	//--------------------------------
	
	function createShader(gl,type,src){
	     var shader = gl.createShader(type);
		 gl.shaderSource(shader,src);
		 gl.compileShader(shader);
		 var res = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
		 if(res)return shader;
	}
	
    
//---------------------------------
// ** newTex: creates a texture from an image object
function newTex(image){
 let tex = ctx.createTexture();
 ctx.bindTexture(ctx.TEXTURE_2D,tex);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
 ctx.texImage2D(ctx.TEXTURE_2D,0,ctx.RGBA,image.width, image.height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE,new Uint8Array(image.data)); 
 return tex;
}

//---------------------------------
function copyArr(dest,pos,src){
	for(let i=0;i<src.length&&pos<MAX_VERTEX_NUM;i++,pos++)
			dest[pos]=src[i]
}

//---------------------------------
// ** drawAll
function drawAll(){
	setBuffer(vbuf,  vArr ) 
	setBuffer(cbuf,  cArr ) 
	setBuffer(tbuf,  tArr )
		  
	ctx.drawArrays(ctx.TRIANGLES,0,vNum);
	 
	vNum=0
}