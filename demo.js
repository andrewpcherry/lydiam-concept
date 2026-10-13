(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const F={GBP:'gb',EUR:'eu',USD:'us',AED:'ae',INR:'in',PLN:'pl'},NM={GBP:'Pound sterling',EUR:'Euro',USD:'US dollar',AED:'UAE dirham',INR:'Indian rupee',PLN:'Polish złoty'};
let R={USD:1,EUR:.894,GBP:.756,AED:3.6725,INR:95.8,PLN:3.8};
const fmt=(n,c)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c,currencyDisplay:'narrowSymbol'}).format(n);
const num=s=>parseFloat(String(s).replace(/[^0-9.]/g,''))||0,gbp=(v,c)=>v/R[c]*R.GBP;
const S0={bal:{GBP:412500,EUR:268300,USD:390120,AED:920000,INR:18400000,PLN:310000},tx:[['Atlas Trading','Received','USD',42000],['London office rent','Paid','GBP',-12400],['GBP to EUR','Converted','EUR',30000]],payees:[['Kraków Components','EUR','pl',0],['Kochi payroll','INR','in',0],['London landlord','GBP','gb',0]],appr:[],cards:[['Operations','4410',0],['Travel','8823',0]],dev:[['MacBook Pro','London','This device'],['iPhone','London','2 hours ago'],['iPad','Dubai','Yesterday']]};
let S=JSON.parse(JSON.stringify(S0));
const toast=m=>{const t=$('#t');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2600)};
const opts=(el,v)=>{el.innerHTML=Object.keys(S.bal).map(c=>`<option>${c}</option>`).join('');if(v)el.value=v};
function draw(){let t=0;$('#bals').innerHTML=Object.entries(S.bal).map(([c,v])=>{t+=gbp(v,c);return `<div><img src="https://flagcdn.com/w80/${F[c]}.png" alt=""><small>${NM[c]}</small><b>${fmt(v,c)}</b></div>`}).join('');$('#tot').textContent=fmt(t,'GBP');
  $('#tx').innerHTML=S.tx.slice(0,7).map(([n,k,c,v])=>`<div class="row"><span class="nm">${n}<small>${k}</small></span><span class="v ${v>0?'pos':''}">${v>0?'+':'−'}${fmt(Math.abs(v),c)}</span></div>`).join('');
  $('#pp').innerHTML=S.payees.map((p,i)=>`<option value="${i}">${p[0]} (${p[1]})${p[3]?' · available tomorrow':''}</option>`).join('');
  $('#pl').innerHTML=S.payees.map(p=>`<div class="row"><img src="https://flagcdn.com/w80/${p[2]}.png" alt=""><span class="nm">${p[0]}<small>${p[1]} account</small></span><span class="chip ${p[3]?'wait':''}">${p[3]?'Cooling off, 24h':'Trusted'}</span></div>`).join('');
  $('#ac').textContent=S.appr.length;
  $('#al').innerHTML=S.appr.length?S.appr.map((a,i)=>`<div class="row"><span class="nm">${a.n}<small>${fmt(a.v,a.c)} · requested by Anna</small></span><button class="sbtn" data-no="${i}">Decline</button><button class="sbtn dark" data-ok="${i}">Approve</button></div>`).join(''):'<p class="lead" style="margin:0">Nothing waiting. Send a payment over £20,000 to see this.</p>';
  $$('[data-ok]').forEach(b=>b.onclick=()=>{const a=S.appr.splice(+b.dataset.ok,1)[0];S.bal[a.c]-=a.v;S.tx.unshift([a.n,'Paid, approved by 2',a.c,-a.v]);toast('Approved and sent');draw()});
  $$('[data-no]').forEach(b=>b.onclick=()=>{S.appr.splice(+b.dataset.no,1);toast('Payment declined');draw()});
  $('#cl').innerHTML=S.cards.map((c,i)=>`<div><div class="mcard" style="${c[2]?'filter:grayscale(1) brightness(.75)':''}"><span class="w">LYDIAM</span><span class="n"><span>•••• ${c[1]}</span><span>${c[2]?'Frozen':c[0]}</span></span></div><div class="row" style="margin-top:14px;max-width:300px"><span class="nm">Freeze card</span><button class="tog ${c[2]?'on':''}" data-f="${i}" aria-label="Freeze card"></button></div></div>`).join('');
  $$('[data-f]').forEach(b=>b.onclick=()=>{const c=S.cards[+b.dataset.f];c[2]=!c[2];toast(c[2]?'Card frozen':'Card unfrozen');draw()});
  $('#dl').innerHTML=S.dev.map(d=>`<div class="row"><span class="nm">${d[0]}<small>${d[1]}</small></span><span class="chip ${d[2]==='This device'?'':'wait'}">${d[2]}</span></div>`).join('');
  conv()}
function conv(){const a=num($('#ca').value),f=$('#cf').value,t=$('#ct').value,r=R[t]/R[f];$('#co').textContent=fmt(a*r*(1-.0035),t);$('#cr').textContent=`1 ${f} = ${r.toFixed(r>=10?2:4)} ${t} · fee ${fmt(a*.0035,f)} (illustrative)`}
opts($('#cf'),'GBP');opts($('#ct'),'EUR');opts($('#pc'),'EUR');['#ca','#cf','#ct'].forEach(x=>$(x).addEventListener('input',conv));
$('#cgo').onclick=()=>{const a=num($('#ca').value),f=$('#cf').value,t=$('#ct').value;if(f===t)return toast('Pick two different currencies');if(a>S.bal[f])return toast('Not enough '+f);const o=a*R[t]/R[f]*(1-.0035);S.bal[f]-=a;S.bal[t]+=o;S.tx.unshift([`${f} to ${t}`,'Converted',t,o]);toast('Converted');draw()};
$('#pgo').onclick=()=>{const p=S.payees[+$('#pp').value],a=num($('#pa').value),c=$('#pc').value;if(!a)return;if(p[3])return toast('This payee can be paid from tomorrow');if(a>S.bal[c])return toast('Not enough '+c);
  if(gbp(a,c)>20000){S.appr.push({n:p[0],v:a,c});toast('Over £20,000. Sent to a second approver.');draw();return}S.bal[c]-=a;S.tx.unshift([p[0],'Paid','c'==c?c:c,-a]);toast('Payment sent');draw()};
$('#pnew').onclick=()=>{const n=prompt('Payee name','Gulf Freight LLC');if(!n)return;S.payees.push([n,'AED','ae',1]);toast('Payee added. Available in 24 hours.');draw()};
$('#lo').onclick=()=>{S.dev=S.dev.slice(0,1);toast('Logged out of all other devices');draw()};
$('#reset').onclick=e=>{e.preventDefault();S=JSON.parse(JSON.stringify(S0));toast('Demo reset');draw()};
$$('aside button').forEach(b=>b.onclick=()=>{$$('aside button').forEach(x=>x.classList.toggle('on',x===b));$$('.ap2').forEach(s=>s.classList.toggle('on',s.dataset.v===b.dataset.v));scrollTo(0,0)});
draw();
fetch('https://api.frankfurter.dev/v1/latest?from=USD&symbols=EUR,GBP,INR,PLN').then(r=>r.json()).then(d=>{Object.assign(R,d.rates);R.USD=1;R.AED=3.6725;draw()}).catch(()=>{});
})();