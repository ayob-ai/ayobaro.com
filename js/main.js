(()=>{const d=document,r=d.documentElement,$=(s,c=d)=>[...c.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches,home=d.body.classList.contains('home');
let st=null;try{st=JSON.parse(sessionStorage.getItem('ay.m'))}catch(_){}
let tx=st?Math.min(st.x,innerWidth):innerWidth/2,ty=st?Math.min(st.y,innerHeight):innerHeight*.35,cx=tx,cy=ty,seen=0,sx=tx,sy=ty,vel=0,lastY=scrollY;
/* remember the pointer across page loads so the cursor never jumps to a default spot */
if(fine){const sv=()=>{try{sessionStorage.setItem('ay.m',JSON.stringify({x:tx,y:ty}))}catch(_){}};addEventListener('pagehide',sv);addEventListener('beforeunload',sv);d.addEventListener('click',sv,true);
 if(st){const s=r.style;s.setProperty('--rx',tx/innerWidth-.5);s.setProperty('--ry',ty/innerHeight-.5)}else r.classList.add('cw')}

/* ── preloader gif: shown on the black screen while a page arrives (never on leave, so it can't visibly restart) ── */
if(!calm){const pl=d.createElement('div');pl.className='pl';pl.setAttribute('aria-hidden','true');pl.innerHTML='<img src="images/preloader.gif" alt="" decoding="sync">';d.body.append(pl);pl.addEventListener('animationend',()=>pl.remove())}

/* ── pointer: CSS vars for parallax + targets for the chrome torch / cursor ── */
if(fine)addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;seen=performance.now();r.classList.remove('cw');const x=tx/innerWidth,y=ty/innerHeight,s=r.style;s.setProperty('--px',tx+'px');s.setProperty('--py',ty+'px');s.setProperty('--mx',x*100+'%');s.setProperty('--rx',x-.5);s.setProperty('--ry',y-.5);
 const m=e.target.closest&&e.target.closest('.mix');if(m){const b=m.getBoundingClientRect();m.style.setProperty('--cx',tx-b.left+'px');m.style.setProperty('--cy',ty-b.top+'px')}},{passive:true});

/* ── scroll: header state, progress bar ── */
const sc=()=>{r.classList.toggle('sc',scrollY>40);const h=d.body.scrollHeight-innerHeight;r.style.setProperty('--sp',h>0?Math.min(1,scrollY/h):0)};addEventListener('scroll',sc,{passive:true});sc();

/* ── nav, page-wipe transition ── */
const mb=$('.mb')[0];mb&&(mb.onclick=()=>{mb.setAttribute('aria-expanded',r.classList.toggle('nav-open'))});
d.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||a.target||e.metaKey||e.ctrlKey||e.shiftKey||a.origin!==location.origin||(a.hash&&a.pathname===location.pathname))return;e.preventDefault();r.classList.add('out');setTimeout(()=>location.href=a.href,calm?0:560)});
addEventListener('pageshow',e=>{if(e.persisted)r.classList.remove('out','nav-open')});

/* ── custom cursor ── */
let ring,dot;
if(fine&&!calm){ring=d.createElement('div');ring.className='cur';dot=d.createElement('div');dot.className='dt';d.body.append(ring,dot);ring.style.transform='translate3d('+cx+'px,'+cy+'px,0)';dot.style.transform='translate3d('+tx+'px,'+ty+'px,0)';r.classList.add('cx');
 d.addEventListener('pointerover',e=>{const t=e.target;r.classList.toggle('ci',t.tagName==='IFRAME');r.classList.toggle('ch',!!(t.closest&&t.closest('a,button,[role=button],.mix,.tags li,.do li')));r.classList.toggle('cd',!!(t.closest&&t.closest('input,textarea')))});
 d.addEventListener('pointerleave',()=>r.classList.add('ci'));d.addEventListener('pointerenter',()=>r.classList.remove('ci'))}

/* ── scramble text on nav / buttons (soft: a short 3-letter window, slower) ── */
const G='01#/\\<>*+=%&@',scr=el=>{if(calm||el.dataset.s)return;const o=el.textContent;el.dataset.s=1;let n=0;const id=setInterval(()=>{el.textContent=[...o].map((c,i)=>c===' '||i<n||i>=n+3?c:G[Math.random()*G.length|0]).join('');n+=.4;if(n>=o.length){clearInterval(id);el.textContent=o;delete el.dataset.s}},46)};
$('nav a,.btn,.tags li,.soc .l').forEach(el=>el.addEventListener('pointerenter',()=>scr(el)));

/* ── magnetic pulls ── */
if(fine&&!calm)$('.btn,.lk a,.pb,.mb,.soc a').forEach(el=>{el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();el.style.translate=((e.clientX-b.left-b.width/2)*.28)+'px '+((e.clientY-b.top-b.height/2)*.28)+'px'});el.addEventListener('pointerleave',()=>el.style.translate='')});

/* ── home: orbiting text ring ── */
const hero=$('.hero')[0];
if(hero){const t=['Ayobaro','Producer','Audio Engineer','Berlin'],s=Array(2).fill(t.map(x=>x+'  +  ').join('')).join('');
 hero.insertAdjacentHTML('afterbegin','<svg class="ring" viewBox="0 0 400 400" aria-hidden="true"><defs><path id="rp" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0"/></defs><text><textPath href="#rp" textLength="1100" lengthAdjust="spacing">'+s+'</textPath></text></svg>')}

/* ── marquee bands above the footer ── */
const mq=[];
if(!home&&d.querySelector('footer')){const it=['Ayobaro','Producer','Audio Engineer','Berlin'],row=()=>it.map(x=>x+'<i></i>').join(''),w=d.createElement('div');w.className='mqw';w.setAttribute('aria-hidden','true');
 w.innerHTML='<div class="mqb"><div class="mq">'+row().repeat(8)+'</div></div><div class="mqb"><div class="mq">'+row().repeat(8)+'</div></div>';d.querySelector('footer').before(w);
 $('.mq',w).forEach((el,i)=>mq.push({el,x:0,dir:i?1:-1,w:0}));const meas=()=>mq.forEach(m=>m.w=m.el.scrollWidth/2);meas();addEventListener('load',meas);addEventListener('resize',meas)}

/* ── WebGL liquid-chrome field, lit by the cursor ── */
let GL;
const cv=d.createElement('canvas');cv.className='gl';cv.setAttribute('aria-hidden','true');d.body.prepend(cv);
const g=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});
if(!g)cv.remove();else{
 const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',
 fs=`precision mediump float;uniform vec2 R,M;uniform float T,K,S,Q;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
void main(){vec2 fc=gl_FragCoord.xy;vec2 p=(fc-.5*R)/R.y;p.y+=S;
 vec2 q=vec2(fbm(p*1.5+T*.05),fbm(p*1.5+vec2(5.2,1.3)-T*.04));
 float v=fbm(p*1.3+2.4*q+vec2(T*.03,-T*.02));
 float band=sin(v*20.+T*.25);float c=pow(smoothstep(-.35,.95,band),1.7);
 float e=pow(1.-abs(2.*fract(v*5.5)-1.),7.);
 float chrome=c*.6+e*.5;
 float d=length(fc-M)/R.y;float spot=exp(-d*d*11.)+.35*exp(-d*d*2.2);
 float vig=smoothstep(1.25,.25,length((fc-.5*R)/R.y));
 float I=(K+spot*Q)*vig;
 gl_FragColor=vec4(vec3(.78,.83,1.)*chrome*I,1.);}`;
 const sh=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);return o},pr=g.createProgram();
 g.attachShader(pr,sh(g.VERTEX_SHADER,vs));g.attachShader(pr,sh(g.FRAGMENT_SHADER,fs));g.linkProgram(pr);
 if(!g.getProgramParameter(pr,g.LINK_STATUS))cv.remove();else{
  g.useProgram(pr);const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);
  const a=g.getAttribLocation(pr,'p');g.enableVertexAttribArray(a);g.vertexAttribPointer(a,2,g.FLOAT,false,0,0);
  const u=n=>g.getUniformLocation(pr,n),uR=u('R'),uM=u('M'),uT=u('T'),uK=u('K'),uS=u('S'),uQ=u('Q');
  const rs=()=>{const k=innerWidth<700?.4:.5;cv.width=Math.max(2,innerWidth*k|0);cv.height=Math.max(2,innerHeight*k|0);g.viewport(0,0,cv.width,cv.height)};rs();addEventListener('resize',rs);
  GL=t=>{const k=cv.width/innerWidth;g.uniform2f(uR,cv.width,cv.height);g.uniform2f(uM,sx*k,cv.height-sy*k);g.uniform1f(uT,t);g.uniform1f(uK,home?.2:.1);g.uniform1f(uQ,home?1.05:.55);g.uniform1f(uS,scrollY*.0006);g.drawArrays(g.TRIANGLES,0,3)}}}

/* ── one shared frame loop ── */
const tick=now=>{const t=now/1000;
 if(!fine){tx=innerWidth*(.5+.32*Math.sin(t*.37));ty=innerHeight*(.45+.3*Math.cos(t*.51))}
 sx+=(tx-sx)*.07;sy+=(ty-sy)*.07;
 if(ring){cx+=(tx-cx)*.32;cy+=(ty-cy)*.32;ring.style.transform='translate3d('+cx+'px,'+cy+'px,0)';dot.style.transform='translate3d('+tx+'px,'+ty+'px,0)'}
 vel+=((scrollY-lastY)-vel)*.15;lastY=scrollY;
 mq.forEach(m=>{m.x+=m.dir*(1.1+Math.abs(vel)*.35);if(m.w){if(m.x<=-m.w)m.x+=m.w;if(m.x>0)m.x-=m.w;m.el.style.transform='translate3d('+m.x+'px,0,0)'}});
 GL&&GL(t);requestAnimationFrame(tick)};
if(calm){GL&&GL(8)}else{requestAnimationFrame(tick)}

/* ── mixes (original behaviour) ── */
let cur;const f=s=>isFinite(s)?(s/60|0)+':'+String(s%60|0).padStart(2,'0'):'–:–';
$('.mix').forEach(m=>{const b=$('button',m)[0],g=$('input',m)[0],t=$('time',m)[0];let a;
const v=d.createElement('input');v.type='range';v.className='vol';v.min=0;v.max=100;v.value=80;v.style.setProperty('--p','80%');v.setAttribute('aria-label','Volume '+$('b',m)[0].textContent);t.after(v);
v.oninput=()=>{v.style.setProperty('--p',v.value+'%');if(a)a.volume=v.value/100};
const mk=()=>{a=new Audio(m.dataset.src);a.volume=v.value/100;a.preload='none';
a.ontimeupdate=()=>{g.value=a.currentTime/a.duration*1000||0;g.style.setProperty('--p',g.value/10+'%');t.textContent=f(a.currentTime)+' / '+f(a.duration)};
a.onplay=()=>{m.classList.add('on');b.setAttribute('aria-pressed','true')};
a.onpause=a.onended=()=>{m.classList.remove('on');b.setAttribute('aria-pressed','false')};return a};
b.onclick=()=>{a=a||mk();if(cur&&cur!==a)cur.pause();cur=a;a.paused?a.play():a.pause()};
g.oninput=()=>{a=a||mk();if(isFinite(a.duration))a.currentTime=g.value/1000*a.duration}});

/* ── videos (original behaviour) ── */
let yt;const api=()=>yt||(yt=new Promise(ok=>{const s=d.createElement('script');s.src='https://www.youtube.com/iframe_api';d.head.append(s);window.onYouTubeIframeAPIReady=ok}));
$('.vid').forEach(v=>{const go=async()=>{if(v.classList.contains('live'))return;v.classList.add('live');v.removeAttribute('role');v.removeAttribute('tabindex');await api();const h=d.createElement('div');v.replaceChildren(h);new YT.Player(h,{videoId:v.dataset.id,width:'100%',height:'100%',playerVars:{autoplay:1,controls:1},events:{onReady:e=>e.target.setVolume(50)}})};
v.onclick=go;v.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});

/* ── management: highlight the artist in view (original behaviour) ── */
const al=$('.art');if(al.length){const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{rootMargin:'-35% 0px -35% 0px'});al.forEach(x=>io.observe(x))}

/* ── contact form (original behaviour) ── */
const fm=$('form')[0];fm&&fm.addEventListener('submit',async e=>{e.preventDefault();const s=$('.st')[0],b=$('button',fm)[0];b.disabled=true;try{const x=await fetch(fm.action,{method:'POST',body:new FormData(fm),headers:{Accept:'application/json'}});if(!x.ok)throw 0;fm.reset();s.textContent='Message sent. I will get back to you soon.'}catch(_){s.textContent='Could not send. Check your connection and try again.'}b.disabled=false});
})();
