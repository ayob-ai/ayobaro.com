(()=>{const d=document,r=d.documentElement,$=(s,c=d)=>[...c.querySelectorAll(s)];
if(matchMedia('(pointer:fine)').matches)addEventListener('pointermove',e=>{const x=e.clientX/innerWidth,y=e.clientY/innerHeight,s=r.style;s.setProperty('--px',e.clientX+'px');s.setProperty('--py',e.clientY+'px');s.setProperty('--mx',x*100+'%');s.setProperty('--rx',x-.5);s.setProperty('--ry',y-.5)},{passive:true});

const mb=$('.mb')[0];mb.onclick=()=>{mb.setAttribute('aria-expanded',r.classList.toggle('nav-open'))};
d.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||a.target||e.metaKey||e.ctrlKey||e.shiftKey||a.origin!==location.origin||(a.hash&&a.pathname===location.pathname))return;e.preventDefault();r.classList.add('out');setTimeout(()=>location.href=a.href,260)});
addEventListener('pageshow',e=>{if(e.persisted)r.classList.remove('out','nav-open')});
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
let yt;const api=()=>yt||(yt=new Promise(ok=>{const s=d.createElement('script');s.src='https://www.youtube.com/iframe_api';d.head.append(s);window.onYouTubeIframeAPIReady=ok}));
$('.vid').forEach(v=>{const go=async()=>{if(v.classList.contains('live'))return;v.classList.add('live');v.removeAttribute('role');v.removeAttribute('tabindex');await api();const h=d.createElement('div');v.replaceChildren(h);new YT.Player(h,{videoId:v.dataset.id,width:'100%',height:'100%',playerVars:{autoplay:1,controls:1},events:{onReady:e=>e.target.setVolume(50)}})};
v.onclick=go;v.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
const al=$('.art');if(al.length){const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{rootMargin:'-35% 0px -35% 0px'});al.forEach(x=>io.observe(x))}
const fm=$('form')[0];fm&&fm.addEventListener('submit',async e=>{e.preventDefault();const s=$('.st')[0],b=$('button',fm)[0];b.disabled=true;try{const x=await fetch(fm.action,{method:'POST',body:new FormData(fm),headers:{Accept:'application/json'}});if(!x.ok)throw 0;fm.reset();s.textContent='Message sent. I will get back to you soon.'}catch(_){s.textContent='Could not send. Check your connection and try again.'}b.disabled=false});
})();
