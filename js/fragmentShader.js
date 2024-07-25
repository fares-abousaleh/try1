const fragmentShader =
`
precision mediump float;

uniform float tm;
uniform float X;
uniform float Y;
 
varying vec4 clr;

varying vec2 texc;

varying vec2 pos ;

uniform sampler2D txMonster;

uniform sampler2D txRand;

void main(){
   
   float x = X+pos.x;
   float y = Y+pos.y;
   
   if(texc.x<1.0)  // not a stone
	gl_FragColor =   clr  *  texture2D(txMonster,texc)  ; 
   
   else
   {
	   float cf = (texc.x<2.0)?2.3243:4.0;
	   vec2 q = 0.001*vec2( sin(10.1*(y-x)-tm*14.0)*cos( 13.3*x+ 9.0*tm ),
							sin(11.1*(x-y)+tm*13.0)*cos( 15.5*y+ 8.0*tm )
					      );
	   gl_FragColor =  clr*     texture2D(txMonster,q+ 0.123*sin( cf*(pos+vec2(X,Y)))+vec2(0.625,0.625)) ; 
   }
   
}

`

	
