
var rate = 44100 

var audio_context = undefined

var snd = makeSound(500)

var isPlaying = false

var sndBom = [makeBom(69000,0.9999,400),makeBom(69000,0.9999,950),makeBom(69000,0.9999,660),makeBom(69000,0.999,460),]

function makeBom(N=8000,g=0.96,L=400){
	
	let snd = new Float32Array(N)
	
	let a =1
	let v = 0
	const d = 1.0 / N
	let lop = 0.1
	
	for(let k=0;k<snd.length;k++,a*=g,lop+=0.06-0.1*lop)
	{
		v = v*lop+(1-lop)* a  * rnd()
		snd[k] = (1-k*d)*v-0.9*(k>L?snd[k-rndInt(0.95*L,L)]:0)
	}
	
	return snd
	
}

function playSnd(buf){
  initAudio()
  if(isPlaying)return
  isPlaying=true
  setTimeout(function(){isPlaying=false},300)
  var source  = audio_context.createBuffer(1,buf.length,rate);
  source.copyToChannel(buf,0,0);
  var oup = audio_context.createBufferSource();
  oup.buffer = source;
  oup.connect(audio_context.destination);
  oup.start(0);
}

function makeSound(fr){
	if(fr==undefined) fr = 500
	let snd = new Float32Array(60000)
	let a =1
	let th =0
	let dth = Math.PI*2*fr/rate
	const dth0 = Math.PI*4*fr/rate
	for(let k=0;k<snd.length;k++){
		snd[k] = sat(0.1*th,0,1)*Math.sin(th)*a
		th += dth
		dth += 0.001*(dth0-dth)
		a *=0.99883
	}
	return snd
}

function initAudio(){
	if(!audio_context) audio_context = new AudioContext();
}  

const musicSad =  new Audio("./assets/musicSad.wav")
const musicHappy = new Audio("./assets/musicHappy.wav")
