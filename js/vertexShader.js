const vertexShader = 
`
attribute vec2 a_Position;
	
attribute vec4 color;

attribute vec2 texco;

varying vec2 texc;

varying vec2 pos;

varying vec4 clr;

void main(){
   
   vec2 cf = vec2(1.0, 16.0/9.0);
   
   gl_Position =  vec4(a_Position*cf,0.0,1.0);
   
   clr  = color;
   
   pos  = a_Position;
   
   texc = texco;
   
}
	
`