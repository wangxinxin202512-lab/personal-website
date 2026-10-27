(() => {
const portfolio=document.querySelector('.portfolio');
const welcome=document.querySelector('#welcome');
const board=document.querySelector('#board');
let completed=false;
function finishIntro(){
 if(completed)return;
 completed=true;
 cancelAnimationFrame(frame);
 board.inert=false;
 board.removeAttribute('aria-hidden');
 welcome.setAttribute('aria-hidden','true');
 portfolio.classList.add('is-complete');
 document.dispatchEvent(new Event('board:shown'));
}
const canvas=document.getElementById('fold-scene'),ctx=canvas.getContext('2d',{alpha:false}),W=1440,H=900;
const paths={board:'assets/board-final.png',cover:'assets/welcome-final.png',first:'assets/fold-one.jpg',second:'assets/fold-two.jpg',back:'assets/paper-back.jpg'},img={};
const h0=.188*W,h1=.265*W,k=(h1-h0)/H,A=[.635*W,0],B=[W,.38*H];
const len=Math.hypot(B[0]-A[0],B[1]-A[1]),ux=(B[0]-A[0])/len,uy=(B[1]-A[1])/len;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
let texture,firstFrame,started=0,frame=0;
function path(pts){ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath()}
function paint(image,alpha=1){ctx.globalAlpha=alpha;ctx.drawImage(image,0,0,W,H);ctx.globalAlpha=1}
function clipLeft(){path([[0,0],[h0,0],[h1,H],[0,H]]);ctx.clip()}
function clipRight(){path([[h0,0],[W,0],[W,H],[h1,H]]);ctx.clip()}
function clipMoving(){path([[0,0],A,B,[W,H],[0,H]]);ctx.clip()}
function backside(){ctx.fillStyle=texture;ctx.fillRect(-W,-H,3*W,3*H)}
function shade(a){ctx.fillStyle='#2b4143';ctx.globalAlpha=a;ctx.fillRect(-W,-H,3*W,3*H);ctx.globalAlpha=1}
function makeTexture(){
 const c=document.createElement('canvas');c.width=c.height=128;
 const g=c.getContext('2d');g.fillStyle='#d8eceb';g.fillRect(0,0,128,128);
 let s=27;for(let i=0;i<7500;i++){s=(s*1664525+1013904223)>>>0;const x=s%128;s=(s*1664525+1013904223)>>>0;const y=s%128;g.fillStyle=i%2?'rgba(61,104,108,.048)':'rgba(255,255,255,.15)';g.fillRect(x,y,1,2)}
 return ctx.createPattern(c,'repeat')
}
function foldOne(angle){
 paint(img.board);
 ctx.save();clipRight();paint(img.cover);ctx.restore();
 const c=Math.cos(angle);
 if(Math.abs(c)>.01){
  ctx.save();ctx.transform(c,0,(1-c)*k,1,(1-c)*h0,0);clipLeft();
  if(c>0)paint(img.cover);else backside();
  shade(.13*Math.sin(angle));ctx.restore()
 }
 ctx.save();ctx.globalAlpha=.17*Math.sin(angle);ctx.strokeStyle='#334f50';ctx.lineWidth=5;
 ctx.beginPath();ctx.moveTo(h0,0);ctx.lineTo(h1,H);ctx.stroke();ctx.restore()
}
function foldTwo(angle){
 paint(img.board);
 const t=angle/Math.PI;
 ctx.save();path([A,[W,0],B]);ctx.clip();
 paint(firstFrame,1-ease((t-.50)/.5));paint(img.second,ease((t-.50)/.5));ctx.restore();
 const c=Math.cos(angle),m11=ux*ux+c*(1-ux*ux),m12=ux*uy*(1-c),m21=m12,m22=uy*uy+c*(1-uy*uy);
 const dx=A[0]-m11*A[0]-m12*A[1],dy=A[1]-m21*A[0]-m22*A[1];
 const tail=1-ease((t-.88)/.12);
 if(Math.abs(c)>.01 && tail>0){
  ctx.save();ctx.transform(m11,m21,m12,m22,dx,dy);clipRight();clipMoving();
  if(c>0)paint(firstFrame);else{ctx.globalAlpha=tail;backside();ctx.globalAlpha=1}
  shade(.16*Math.sin(angle)*tail);ctx.restore()
 }
 ctx.save();ctx.globalAlpha=.2*Math.sin(angle);ctx.strokeStyle='#3d5b5c';ctx.lineWidth=6;
 ctx.beginPath();ctx.moveTo(...A);ctx.lineTo(...B);ctx.stroke();ctx.restore()
}
function render(p){
 ctx.clearRect(0,0,W,H);
 if(p<=.46)foldOne(Math.PI*ease((p-.025)/.435));
 else if(p<=.94)foldTwo(Math.PI*ease((p-.46)/.48));
 else{paint(img.board);ctx.save();path([A,[W,0],B]);ctx.clip();paint(img.second,1-ease((p-.94)/.06));ctx.restore()}
}

function tick(now){
 const p=clamp((now-started)/4500);
 render(p);
 if(p<1)frame=requestAnimationFrame(tick);
 else frame=requestAnimationFrame(finishIntro);
}
if(matchMedia('(prefers-reduced-motion: reduce)').matches){finishIntro();return;}
Promise.all(Object.entries(paths).map(([key,src])=>new Promise((resolve,reject)=>{
 const image=new Image();
 image.onload=()=>{img[key]=image;resolve()};
 image.onerror=reject;
 image.src=src;
}))).then(()=>{
 if(completed)return;
 texture=ctx.createPattern(img.back,'repeat');
 foldOne(Math.PI);
 firstFrame=document.createElement('canvas');
 firstFrame.width=W;firstFrame.height=H;
 firstFrame.getContext('2d').drawImage(canvas,0,0);
 started=performance.now();
 frame=requestAnimationFrame(tick);
}).catch(finishIntro);
})();
