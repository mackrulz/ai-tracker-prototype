(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var KEY='aitracker-proto-v2';
var P={gpt:{n:'ChatGPT',a:'GP'},gem:{n:'Gemini',a:'Ge'},cla:{n:'Claude',a:'Cl'},grk:{n:'Grok',a:'Gk'},gai:{n:'Google AI',a:'G'}};
var PK=['gpt','gem','cla','grk','gai'];
function Q(t,ask,g,ge,c,k,ga){return {t:t,ask:ask||null,st:{gpt:g,gem:ge,cla:c,grk:k,gai:ga}}}
function defaults(){return {
 site:'doktorburak.com', onboarded:false, compsTouched:false, done:{},
 comps:[{n:'Moda Diş Kliniği',d:'Kadıköy · İmplant, ortodonti'},{n:'Dt. Selin Aydın',d:'Kadıköy · Estetik diş, beyazlatma'},{n:'Kadıköy Gülüş Merkezi',d:'Kadıköy · Gülüş tasarımı, zirkonyum'}],
 qs:[Q("Kadıköy'de en iyi diş hekimi","Kadıköy'de en iyi diş hekimi kim?",0,2,true,0,0),
  Q("İstanbul'da implant için kime gitmeliyim",null,0,3,0,4,0),
  Q("Diş beyazlatma fiyatları Kadıköy",null,2,1,2,3,0),
  Q("Kadıköy'de zirkonyum kaplama",null,0,2,3,0,0),
  Q("Acil diş hekimi Kadıköy",null,3,1,0,2,2),
  Q("İmplant fiyatları 2026",null,0,0,0,0,0),
  Q("Gülüş tasarımı nerede yaptırılır",null,0,4,2,2,0),
  Q("Çocuk diş hekimi Kadıköy",null,0,0,1,0,0),
  Q("Diş teli şeffaf plak",null,0,3,0,0,0),
  Q("Ağrısız diş çekimi",null,2,1,3,3,1)]
}}
var S; try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){} if(!S||!S.qs) S=defaults();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function initials(n){var w=n.replace(/^(Dt\.|Dr\.)\s*/i,'').split(/\s+/).filter(Boolean);return ((w[0]||'?')[0]+((w[1]||'')[0]||'')).toLocaleUpperCase('tr-TR')}
var X12='<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="#6B7A90" stroke-width="1.8" stroke-linecap="round"/></svg>';
var OK='<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var NO='<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
var CHEV='<svg width="8" height="14" viewBox="0 0 8 14"><path d="M1.5 1.5L6.5 7l-5 5.5" stroke="#9AA6B8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function rec(v){return v===true||v>0}
function stTxt(v){return v===true?'Önerdi':v>0?v+'. sırada':'Önermedi'}

/* ---------- toast / banner / sheet ---------- */
var tT;function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){t.classList.remove('on')},2200)}
var bT;function banner(){var b=$('#banner');b.classList.add('on');clearTimeout(bT);bT=setTimeout(function(){b.classList.remove('on')},4200)}
function sheet(on){$('#sheet').classList.toggle('on',on)}

/* ---------- navigation ---------- */
var MAIN=['s06','sQ','s08','s09','s07'], TABS=['s06','sQ','s08','s09'];
var stack=[], cur=null, busy=false;
function setDock(id){var show=MAIN.indexOf(id)>=0;$('.dock').classList.toggle('hide',!show);$('#edge').classList.toggle('hide',!show);
 var tab=id==='s07'?'sQ':id;$$('.gt').forEach(function(g){g.classList.toggle('on',g.getAttribute('data-tab')===tab)})}
function anim(el,frames,dur){return el.animate?el.animate(frames,{duration:dur||340,easing:'cubic-bezier(.25,.8,.25,1)',fill:'none'}):{finished:Promise.resolve(),onfinish:null}}
function show(id,mode){
 var next=document.getElementById(id), prev=cur?document.getElementById(cur):null;
 if(!next||next===prev)return;
 if(RENDER[id])RENDER[id]();
 next.classList.add('active'); var c=$('.content',next); if(c&&mode!=='none')c.scrollTop=0;
 setDock(id);
 if(prev){
  var fin=function(){if(cur!==prev.id)prev.classList.remove('active')};
  if(mode==='fwd'){anim(next,[{transform:'translateX(100%)'},{transform:'translateX(0)'}]);var a=anim(prev,[{transform:'translateX(0)',filter:'brightness(1)'},{transform:'translateX(-30%)',filter:'brightness(.92)'}]);setTimeout(fin,330)}
  else if(mode==='back'){next.style.zIndex=1;prev.style.zIndex=3;anim(next,[{transform:'translateX(-30%)'},{transform:'translateX(0)'}]);anim(prev,[{transform:'translateX(0)'},{transform:'translateX(100%)'}]);setTimeout(function(){prev.style.zIndex='';next.style.zIndex='';fin()},330)}
  else {anim(next,[{opacity:0,transform:'scale(.985)'},{opacity:1,transform:'none'}],240);setTimeout(fin,240)}
 }
 cur=id; if(id==='s05')startScan(); else stopScan();
}
function go(id){stack.push(id);show(id,'fwd')}
function back(){if(stack.length>1){stack.pop();show(stack[stack.length-1],'back')}}
function tab(id){stack=[id];show(id,'fade')}
function enterMain(){S.onboarded=true;save();stack=['s06'];show('s06','fade')}

/* ---------- 10: lock-screen notifications (modal) ---------- */
function openNtf(){var l=$('#s10');updClock();l.classList.add('active');anim(l,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],420);$('.gbtn i')&&($('.gbtn i').style.display='none')}
function closeNtf(then){var l=$('#s10');var a=anim(l,[{transform:'translateY(0)'},{transform:'translateY(100%)'}],360);setTimeout(function(){l.classList.remove('active');if(then)then()},350)}
function updClock(){var d=new Date();$('#lsTime').textContent=d.getHours()+':'+('0'+d.getMinutes()).slice(-2);
 try{var s=d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'});var p=s.split(' ');$('#lsDate').textContent=(p.length===3?p[2]+' '+p[0]+' '+p[1]:s).replace(/^./,function(c){return c.toLocaleUpperCase('tr-TR')})}catch(e){}}

/* ---------- 03 competitors ---------- */
function rComps(){
 var n=S.comps.length;$('#compTitle').textContent=n===0?'Rakip ekle':(S.compsTouched?n+' rakibin var':n+' rakip bulduk');
 $('#compList').innerHTML=n?S.comps.map(function(c,i){return '<div class="item'+(c.nw?' new':'')+'"><div class="av">'+esc(initials(c.n))+'</div><div style="min-width:0;flex:1"><b style="font-size:16px">'+esc(c.n)+'</b><div class="small">'+esc(c.d)+'</div></div><span class="x" data-act="rm-comp" data-i="'+i+'" aria-label="Çıkar">'+X12+'</span></div>'}).join('')
  :'<div class="item"><div class="small" style="padding:6px 0">Henüz rakip yok. Aşağıdan ekleyebilirsin.</div></div>';
 S.comps.forEach(function(c){delete c.nw});
}
/* ---------- 04 question chips ---------- */
function rChips(){
 $$('#chipWrap .chipq').forEach(function(e){e.remove()});
 var end=$('#chipEnd'),n=S.qs.length;
 S.qs.forEach(function(q,i){var d=document.createElement('div');d.className='chipq';d.innerHTML='<span>'+esc(q.t)+'</span><span class="x" style="width:24px;height:24px;margin:0" data-act="rm-q" data-i="'+i+'" aria-label="Çıkar">'+X12+'</span>';if(!q.nw)d.style.animation='none';delete q.nw;end.parentNode.insertBefore(d,end)});
 $('#qSub').textContent=n?'Bu '+n+' konuyu her hafta '+PK.length+' platformda soracağız.':'Takip etmek istediğin soruları ekle.';
 $('#qFoot').innerHTML=n+' konu × 10 farklı soruluş = <b style="color:var(--navy)">'+(n*10)+' soru</b>';
 $('[data-act="start-scan"]').disabled=!n;
}
function addQ(after){var t=window.prompt('Hastaların AI\'a soracağı yeni soru:', '');if(t&&t.trim()){S.qs.push({t:t.trim(),ask:null,st:null,nw:true});save();after&&after();toast('Soru eklendi')}}
/* ---------- 05 scan ---------- */
var scanRAF=null,scanTO=null,scanDone=false;
function scanRow(k,state,pct){var s=state==='done'?'Tamamlandı':state==='run'?P[k].n+' taranıyor…':'Bekliyor';
 var r=state==='done'?'<span class="tick" style="background:var(--teal)">'+OK+'</span>':state==='run'?'<span class="chip c-g">%'+pct+'</span>':'<span class="small">Sırada</span>';
 return '<div class="card" style="padding:8px 14px"><div class="row"><span class="badge s b-'+k+'">'+P[k].a+'</span><div style="flex:1"><b style="font-size:16px">'+P[k].n+'</b><div class="small">'+s+'</div></div>'+r+'</div><div class="bar" style="margin-top:6px;height:6px"><i style="width:'+(state==='done'?100:state==='run'?pct:0)+'%;background:var(--teal)"></i></div></div>'}
function drawScan(p){var tot=S.qs.length*10;$('#ringN').textContent=Math.round(p*tot);$('#ringT').textContent='/ '+tot+' soru';
 $('#ring').style.background='conic-gradient(var(--teal) 0 '+(p*100)+'%,rgba(255,255,255,.6) '+(p*100)+'% 100%)';
 $('#scanList').innerHTML=PK.map(function(k,i){var lp=Math.max(0,Math.min(1,p*PK.length-i));return scanRow(k,lp>=1?'done':lp>0?'run':'wait',Math.round(lp*100))}).join('')}
function startScan(){stopScan();scanDone=false;var b=$('#scanBtn');b.textContent='Kapat, bildirim bekle';b.className='btn ghost';var t0=performance.now(),D=4000;
 (function step(t){var p=Math.min(1,(t-t0)/D);drawScan(p);if(p<1)scanRAF=requestAnimationFrame(step);else{scanDone=true;b.textContent='Sonuçları gör';b.className='btn';scanTO=setTimeout(function(){if(cur==='s05'){enterMain();setTimeout(banner,450)}},900)}})(t0)}
function stopScan(){cancelAnimationFrame(scanRAF);clearTimeout(scanTO)}
/* ---------- Sorular list ---------- */
var filt='',curQ=0,heroP=null;
function rQList(){
 var n=S.qs.length;$('#qlSub').textContent=n+' konu · '+PK.length+' platform · her hafta ölçülür';
 $('#pfil').innerHTML=[['','Tümü']].concat(PK.map(function(k){return [k,P[k].n]})).map(function(x){return '<span class="chip c-n'+(filt===x[0]?' on':'')+'" data-pf="'+x[0]+'">'+x[1]+'</span>'}).join('');
 $('#qList').innerHTML=S.qs.map(function(q,i){
  var right,pl;
  if(!q.st){pl='<span class="small">Bir sonraki taramada ölçülecek</span>';right='<span class="chip c-y">Ölçülüyor</span>'}
  else{pl=PK.map(function(k){return '<span class="badge xs b-'+k+(rec(q.st[k])?'':' off')+'" title="'+P[k].n+'">'+P[k].a+'</span>'}).join('');
   if(filt){var v=q.st[filt];right='<span class="chip '+(rec(v)?'c-g':'c-r')+'">'+stTxt(v)+'</span>'}
   else{var c=PK.filter(function(k){return rec(q.st[k])}).length;right='<span class="chip '+(c>=3?'c-g':c>=1?'c-y':'c-r')+'">'+PK.length+'\'te '+c+'</span>'}}
  return '<div class="qi" data-q="'+i+'"><div style="flex:1;min-width:0"><div class="t">'+esc(q.t)+'</div><div class="pl">'+pl+'</div></div>'+right+CHEV+'</div>'}).join('')||'<div class="qi"><span class="small">Takip edilen soru yok.</span></div>';
}
/* ---------- 07 question detail ---------- */
function rDetail(){
 var q=S.qs[curQ]||S.qs[0]; if(!q)return; var st=q.st;
 $('#qdTitle').textContent='“'+(q.ask||q.t)+'”';
 var k=heroP||filt||(PK.filter(function(x){return !rec(st[x])})[0])||'gpt'; heroP=k;
 var a=(S.comps[0]||{n:'Moda Diş Kliniği'}).n,b=(S.comps[1]||{n:'Dt. Selin Aydın'}).n, v=st[k], nm=P[k].n;
 var badge='<span class="gp"><span class="badge xs b-'+k+'">'+P[k].a+'</span> '+nm+'</span>';
 var h;
 if(!rec(v)) h='<div class="hl red" style="margin-top:12px;padding:16px 18px"><div class="row" style="justify-content:space-between;margin-bottom:10px">'+badge+'<span class="gp">✕ Önerilmedin</span></div><p style="font-size:17px;line-height:22px;font-weight:600;letter-spacing:-.3px"><b>'+nm+' seni önermedi;</b> yerine <b>'+esc(a)+'</b> ve <b>'+esc(b)+'</b>\'ı önerdi.</p><div class="gbox" style="margin-top:12px;padding:10px 14px"><p style="font-size:13px;line-height:18px;color:#fff;font-style:italic">“Kadıköy\'de öne çıkan seçenekler arasında '+esc(a)+' ve '+esc(b)+' sıkça olumlu yorum alıyor…”</p><p style="font-size:11px;color:rgba(255,255,255,.8);margin-top:4px">Örnek AI cevabı · 27 Eki</p></div></div>';
 else h='<div class="hl teal" style="margin-top:12px;padding:16px 18px"><div class="row" style="justify-content:space-between;margin-bottom:10px">'+badge+'<span class="gp">✓ '+(v===true?'Önerildin':v+'. sıradasın')+'</span></div><p style="font-size:17px;line-height:22px;font-weight:600;letter-spacing:-.3px"><b>'+nm+' seni '+(v===true?'önerdi':v+'. sırada önerdi')+'.</b> '+(v===1?'Bu soruda zirvedesin.':'Önünde <b>'+esc(a)+'</b> var.')+'</p><div class="gbox" style="margin-top:12px;padding:10px 14px"><p style="font-size:13px;line-height:18px;color:#fff;font-style:italic">“…Dt. Burak ('+esc(S.site)+') implant ve estetik diş konusunda hastalarından olumlu yorumlar alıyor…”</p><p style="font-size:11px;color:rgba(255,255,255,.8);margin-top:4px">Örnek AI cevabı · 27 Eki</p></div></div>';
 $('#qdHero').innerHTML=h;
 $('#qdList').innerHTML=PK.map(function(x){var r=rec(st[x]);return '<div class="item" data-hp="'+x+'" style="padding:7px 0'+(x===k?';background:rgba(0,196,154,.07);margin:0 -16px;padding:7px 16px':'')+'"><span class="badge xs b-'+x+'">'+P[x].a+'</span><b style="font-size:15px;flex:1">'+P[x].n+'</b><span class="small" style="color:var(--navy2);font-weight:600">'+stTxt(st[x])+'</span><span class="tick" style="background:var(--'+(r?'teal':'red')+')">'+(r?OK:NO)+'</span></div>'}).join('');
}
var RENDER={s03:rComps,s04:rChips,sQ:rQList,s07:rDetail,s02:function(){$('#siteIn').value=S.site}};
function syncSite(){$$('.siteName').forEach(function(e){e.textContent=S.site})}
/* ---------- 09 actions ---------- */
function rDone(){$$('[data-act="do"]').forEach(function(b,i){if(S.done[i]){b.textContent='✓ Yapıldı';b.classList.add('done-btn')}})}

/* ---------- events ---------- */
document.addEventListener('click',function(e){
 var el=e.target.closest('[data-go],[data-back],[data-tab],[data-act],[data-toast],[data-q],[data-pf],[data-hp],[data-ntf]'); if(!el)return;
 if(el.hasAttribute('data-go')){var g=el.getAttribute('data-go');if(cur==='s02'){commitSite()}go(g);return}
 if(el.hasAttribute('data-back')){back();return}
 if(el.hasAttribute('data-tab')){var t=el.getAttribute('data-tab');if(t==='sQ')filt='';if(t!==cur||stack.length>1)tab(t);else{var c=$('#'+t+' .content');c&&c.scrollTo&&c.scrollTo({top:0,behavior:'smooth'})}return}
 if(el.hasAttribute('data-toast')){toast(el.getAttribute('data-toast'));return}
 if(el.hasAttribute('data-q')){var i=+el.getAttribute('data-q'),q=S.qs[i];if(!q.st){toast('Bu soru bir sonraki taramada ölçülecek');return}curQ=i;heroP=null;go('s07');return}
 if(el.hasAttribute('data-pf')){filt=el.getAttribute('data-pf');rQList();return}
 if(el.hasAttribute('data-hp')){heroP=el.getAttribute('data-hp');rDetail();return}
 if(el.hasAttribute('data-ntf')){var n=el.getAttribute('data-ntf');closeNtf(function(){if(n.indexOf('s07')===0){curQ=0;heroP='gpt';stack=['sQ','s07'];show('s07','fade')}else tab(n)});return}
 var a=el.getAttribute('data-act'),idx=+el.getAttribute('data-i');
 switch(a){
  case 'edit-site':var inp=$('#siteIn');if(inp.readOnly){inp.readOnly=false;inp.focus();inp.select();el.textContent='Kaydet'}else{commitSite();el.textContent='Düzelt'}break;
  case 'add-comp':var nm=window.prompt('Rakip klinik ya da hekim adı:','');if(nm&&nm.trim()){S.comps.push({n:nm.trim(),d:'Senin eklediğin',nw:true});S.compsTouched=true;save();rComps()}break;
  case 'rm-comp':S.comps.splice(idx,1);S.compsTouched=true;save();rComps();break;
  case 'add-q':addQ(rChips);break;
  case 'add-q-main':addQ(rQList);break;
  case 'rm-q':S.qs.splice(idx,1);save();rChips();break;
  case 'start-scan':if(S.qs.length)go('s05');break;
  case 'skip-scan':if(scanDone){enterMain();setTimeout(banner,450)}else{stopScan();enterMain();toast('Tarama arka planda sürüyor…');setTimeout(banner,2200)}break;
  case 'settings':sheet(true);break;
  case 'close-sheet':sheet(false);break;
  case 'reset':try{localStorage.removeItem(KEY)}catch(x){}S=defaults();sheet(false);filt='';syncSite();$$('[data-act="do"]').forEach(function(b,i){b.textContent=['Yorum iste','Tamamla','Nasıl?'][i];b.classList.remove('done-btn')});$('.gbtn i')&&($('.gbtn i').style.display='');stack=['s01'];show('s01','fade');break;
  case 'plat':var p=el.getAttribute('data-p')||'';stack=['sQ'];filt=p;show('sQ','fade');break;
  case 'period':var o=['Son 7 gün ▾','Son 30 gün ▾','Son 90 gün ▾'];el.textContent=o[(o.indexOf(el.textContent)+1)%3];toast('Prototipte veriler örnek, dönem değişmez');break;
  case 'do':var bi=$$('[data-act="do"]').indexOf(el);if(!S.done[bi]){S.done[bi]=1;save();rDone();toast('Harika! Etkisini bir sonraki taramada göreceğiz.')}break;
  case 'open-ntf':openNtf();break;
  case 'close-ntf':closeNtf();break;
  case 'banner':$('#banner').classList.remove('on');break;
 }
});
$('#sheet').addEventListener('click',function(e){if(e.target.id==='sheet')sheet(false)});
function commitSite(){var inp=$('#siteIn');var v=inp.value.trim().replace(/^https?:\/\//,'').replace(/\/$/,'');if(v){S.site=v;save();syncSite()}inp.value=S.site;inp.readOnly=true;var b=$('[data-act="edit-site"]');if(b)b.textContent='Düzelt'}
$('#siteIn').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();commitSite();this.blur()}});
// long-press logo on welcome -> settings (reset)
(function(){var lt;function down(){lt=setTimeout(function(){sheet(true)},600)}function up(){clearTimeout(lt)}
 ['logo','logoTxt'].forEach(function(id){var e=document.getElementById(id);if(!e)return;e.addEventListener('touchstart',down,{passive:true});e.addEventListener('mousedown',down);['touchend','touchmove','mouseup','mouseleave'].forEach(function(ev){e.addEventListener(ev,up)})})})();
// iOS: prevent double-tap zoom / pinch in standalone
document.addEventListener('gesturestart',function(e){e.preventDefault()});

/* ---------- boot ---------- */
syncSite();rDone();
var start=S.onboarded?'s06':'s01';stack=[start];show(start,'none');
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(function(){})}
window.__proto={go:go,tab:tab,state:function(){return S},cur:function(){return cur}};
})();
