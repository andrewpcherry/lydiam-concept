/* Site-wide motion. Respects prefers-reduced-motion. */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.add('js-motion');
if(reduce){document.documentElement.classList.add('rm');return}

/* 1. intro sequence on the hero / inner-page hero */
const intro=$$('.hero .copy > *, .ihero > *');
intro.forEach((el,i)=>{el.classList.add('mv-intro');el.style.setProperty('--d',(120+i*110)+'ms')});
setTimeout(()=>intro.forEach(el=>el.classList.add('in')),40);
/* safety net: never leave content hidden */
setTimeout(()=>document.querySelectorAll('.mv-intro:not(.in)').forEach(el=>el.classList.add('in')),2000);

/* 2. scroll reveals with stagger inside groups */
const groups=['.pillars > a','.need-g > div','.bx > .bx-c','.plist > li','.mk-tabs + .mk-row ~ #mk-rows > .mk-row','#mk-rows > .mk-row','.agents > .agent','#reg > .reg-row','.vs > div','.wt tbody tr','.tiers > .tier','.tl > button','.vt > .vbox','.prot > div','.ent tbody tr','.ins > .art','.faqs > details','.fg > div','.need-g > div','.contact > div','.caps > li','#fq > details','.el > *','.dev > *','.balg > div','.cgrid > a','.tiers .tier'];
const singles=['.head','.need > h3','.need > .k2','.ops','.plat .stage','.aud','.ap .phone','.sv','.tools .tp','.stmt','.brief','.tf-hint','.tx','.tx-ctl','.close h2','.close p','.close .cta','.legal','.rail-in','.search','.cats','.qcard','.side','.code','.panel'];
const seen=new Set();
function tag(el,d){if(seen.has(el)||el.closest('.hero'))return;seen.add(el);el.classList.add('mv');el.style.setProperty('--d',d+'ms');io.observe(el)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
function scan(){groups.forEach(g=>{const parents=new Map();$$(g).forEach(el=>{const p=el.parentElement;const i=parents.get(p)||0;parents.set(p,i+1);tag(el,Math.min(i,8)*80)})});singles.forEach(s=>$$(s).forEach(el=>tag(el,0)))}
scan();
setTimeout(()=>document.querySelectorAll('.mv:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in')}),2000);
/* re-scan when scripts render rows later (markets, regions, FAQ filters) */
const mo=new MutationObserver(()=>{clearTimeout(scan._t);scan._t=setTimeout(scan,60)});['#mk-rows','#reg','#fq','#aud','#p-accts','#bals','#qcard','#al','#pl','#cl','#dl'].forEach(id=>{const el=document.querySelector(id);if(el)mo.observe(el,{childList:true})});

/* 3. count-up numbers when they appear */
function countUp(el){const txt=el.textContent.trim();const m=txt.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);if(!m)return;
  const pre=m[1],num=parseFloat(m[2].replace(/,/g,'')),suf=m[3],dec=(m[2].split('.')[1]||'').length,t0=performance.now(),dur=1300;
  const fmt=v=>pre+v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
  el.dataset.counting='1';const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmt(num*e);if(k<1)requestAnimationFrame(step);else{el.textContent=txt;delete el.dataset.counting}};requestAnimationFrame(step)}
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target)}}),{threshold:.6});
$$('#p-total,#sv-keep,#tot,.saving,.balg b').forEach(el=>cio.observe(el));

/* 4. orbit: rotate the whole system, chips stay upright */
$$('.orbit').forEach(o=>{const sys=document.createElement('div');sys.className='sys';$$('.spin',o).forEach(s=>sys.appendChild(s));o.appendChild(sys)});

/* 5. gentle tilt on tier images and the hero card */
$$('.tier .ph, .aud .ph').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

/* 6. hero parallax: the card drifts slower than the page */
const hero=document.querySelector('.hero');if(hero&&innerWidth>1000){let tk=false;addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{const y=Math.min(scrollY,900);hero.style.backgroundPositionY=`calc(50% + ${y*.18}px)`;tk=false})},{passive:true})}

/* 7. sticky nav gains a backdrop after scrolling */
const nav=document.querySelector('.hero nav, .ihead');if(nav){const f=()=>document.documentElement.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',f,{passive:true});f()}
})();
