(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var KEY='aitracker-proto-v4';
var P={gpt:{n:'ChatGPT',a:'GP'},gem:{n:'Gemini',a:'Ge'},gao:{n:'AI Overviews',f:'Google AI Overviews',a:'AO'},gam:{n:'AI Mode',f:'Google AI Mode',a:'AM'},cla:{n:'Claude',a:'Cl'},grk:{n:'Grok',a:'Gk'}};
var PK=['gpt','gem','gao','gam'], LK=['cla','grk'];
var LOCK='<svg class="lk" width="11" height="13" viewBox="0 0 16 20" fill="none"><rect x="1.5" y="8.5" width="13" height="10" rx="2.5" fill="currentColor"/><path d="M4.5 8.5V6a3.5 3.5 0 017 0v2.5" stroke="currentColor" stroke-width="2.2"/></svg>';
function pn(k){return P[k].f||P[k].n}
function Q(t,ask,g,ge,ao,am){return {t:t,ask:ask||null,st:{gpt:g,gem:ge,gao:ao,gam:am}}}
/* business categories: detected from the site, user can change */
function C(n,h,who,desc,tags,noun,dir,priceQ,comps,qs){return {n:n,h:h,who:who,desc:desc,tags:tags,noun:noun,dir:dir,priceQ:priceQ,comps:comps,qs:qs}}
function cp(n,d){return {n:n,d:d}}
var CATS={
 dis:C('Diş hekimi',1,'Dt. Burak',"İmplant ve estetik diş yapan Kadıköy'de bir diş hekimisin, doğru mu?",['Diş hekimi','İmplant','Estetik diş','Kadıköy'],'kliniklerden','Doktortakvimi','İmplant fiyatları',
  [cp('Moda Diş Kliniği','Kadıköy · İmplant, ortodonti'),cp('Dt. Selin Aydın','Kadıköy · Estetik diş, beyazlatma'),cp('Kadıköy Gülüş Merkezi','Kadıköy · Gülüş tasarımı, zirkonyum')],null),
 est:C('Estetik cerrah',1,'Op. Dr. Burak',"Rinoplasti ve yüz estetiği yapan Kadıköy'de bir estetik cerrahsın, doğru mu?",['Estetik cerrah','Rinoplasti','Yüz estetiği','Kadıköy'],'kliniklerden','Doktortakvimi','Rinoplasti fiyatları',
  [cp('Op. Dr. Ece Tunç','Kadıköy · Rinoplasti'),cp('Moda Estetik','Kadıköy · Yüz ve vücut estetiği'),cp('Dr. Kaan Er','Ataşehir · Meme estetiği')],
  ["İstanbul'da en iyi estetik cerrah","Rinoplasti için kime gitmeliyim","Rinoplasti fiyatları 2026","Kadıköy'de burun estetiği","Doğal burun estetiği yapan doktor","Yüz germe ameliyatı nerede yapılır","Liposuction için iyi klinik","Göz kapağı estetiği İstanbul","Estetik cerrah yorumları","Revizyon rinoplasti uzmanı"]),
 psk:C('Psikolog',1,'Uzm. Psk. Burak',"Kadıköy'de yetişkinlerle terapi yapan bir psikologsun, doğru mu?",['Psikolog','Bireysel terapi','Çift terapisi','Kadıköy'],'danışmanlık merkezlerinden','Doktortakvimi','Terapi seansı ücreti',
  [cp('Uzm. Psk. Deniz Ak','Kadıköy · Bireysel terapi'),cp('Moda Psikoloji Merkezi','Kadıköy · Çift ve aile terapisi'),cp('Psk. Mert Can','Online · Kaygı, depresyon')],
  ["Kadıköy'de iyi psikolog","İstanbul'da çift terapisti önerisi","Online terapi yapan psikolog","Kaygı bozukluğu için terapist","Terapi seansı ücreti 2026","EMDR terapisi İstanbul","Depresyon için kime gitmeliyim","Ergen psikoloğu Kadıköy","BDT uzmanı psikolog","Psikolog yorumları Kadıköy"]),
 dyt:C('Diyetisyen',1,'Dyt. Burak',"Kadıköy'de kilo yönetimi danışmanlığı veren bir diyetisyensin, doğru mu?",['Diyetisyen','Kilo verme','Sporcu beslenmesi','Kadıköy'],'diyet merkezlerinden','Doktortakvimi','Diyetisyen ücreti',
  [cp('Dyt. Ayşe Kara','Kadıköy · Kilo yönetimi'),cp('Fit Beslenme Merkezi','Kadıköy · Sporcu beslenmesi'),cp('Dyt. Cem Yılmaz','Online · Diyabet beslenmesi')],
  ["Kadıköy'de en iyi diyetisyen","İstanbul'da online diyetisyen","Kilo vermek için diyetisyen önerisi","Diyetisyen ücreti 2026","Sporcu beslenmesi uzmanı","Hamilelikte diyetisyen","İnsülin direnci diyeti uzmanı","Çocuk diyetisyeni Kadıköy","Diyetisyen yorumları","Ketojenik diyet danışmanı"]),
 dok:C('Diğer doktor / klinik',1,'Dr. Burak',"Kadıköy'de muayenehanesi olan bir hekimsin, doğru mu?",['Doktor','Muayenehane','Kadıköy'],'kliniklerden','Doktortakvimi','Muayene ücreti',
  [cp('Dr. Elif Şahin','Kadıköy · Muayenehane'),cp('Moda Tıp Merkezi','Kadıköy · Poliklinik'),cp('Dr. Okan Demir','Ataşehir · Muayenehane')],
  ["Kadıköy'de iyi doktor önerisi","İstanbul'da güvenilir klinik","Muayene ücreti 2026","Hafta sonu açık doktor Kadıköy","Randevusu kolay doktor","Doktor yorumları Kadıköy","Özel muayenehane önerisi","Uzman doktor nerede bulunur","Kadıköy'de check-up","Online doktor muayenesi"]),
 avk:C('Avukat',0,'Av. Burak',"Kadıköy'de aile ve iş hukuku alanında çalışan bir avukatsın, doğru mu?",['Avukat','Aile hukuku','İş hukuku','Kadıköy'],'hukuk bürolarından','Avukat rehberleri','Avukatlık ücreti',
  [cp('Av. Zeynep Koç','Kadıköy · Aile hukuku'),cp('Moda Hukuk Bürosu','Kadıköy · İş ve ticaret hukuku'),cp('Av. Emre Aslan','Ataşehir · Ceza hukuku')],
  ["İstanbul'da iyi boşanma avukatı","Kadıköy'de avukat önerisi","İş davası için avukat","Avukatlık ücreti 2026","Kira davası avukatı","Miras avukatı İstanbul","Tazminat davası için kime gitmeli","Ücretsiz avukat danışmanlığı","Avukat yorumları Kadıköy","Şirket avukatı önerisi"]),
 gzl:C('Güzellik merkezi',0,'Burak',"Kadıköy'de cilt bakımı ve lazer yapan bir güzellik merkezisin, doğru mu?",['Güzellik merkezi','Cilt bakımı','Lazer','Kadıköy'],'salonlardan','Randevu siteleri','Lazer epilasyon fiyatları',
  [cp('Moda Beauty','Kadıköy · Cilt bakımı'),cp('Lazer Plus','Kadıköy · Lazer epilasyon'),cp('Selin Güzellik','Ataşehir · Kaş, kirpik')],
  ["Kadıköy'de en iyi güzellik merkezi","Lazer epilasyon için iyi yer","Lazer epilasyon fiyatları 2026","Cilt bakımı nerede yaptırılır","Hydrafacial Kadıköy","Kalıcı makyaj önerisi","Güzellik merkezi yorumları","Kaş laminasyonu İstanbul","Bölgesel incelme merkezi","Gelin bakımı paketi"]),
 rst:C('Restoran / kafe',0,'Burak',"Kadıköy'de brunch ve kahve sunan bir kafesin, doğru mu?",['Kafe','Brunch','Kahve','Kadıköy'],'mekanlardan','Google Haritalar','Menü ve fiyatlar',
  [cp('Moda Kahve Evi','Kadıköy · Kahve, tatlı'),cp('Brunch Kadıköy','Kadıköy · Kahvaltı'),cp('Yeldeğirmeni Bistro','Kadıköy · Bistro')],
  ["Kadıköy'de en iyi brunch","Moda'da kahve içilecek yer","Kadıköy'de laptopla çalışılacak kafe","Kadıköy kahvaltı mekanları","Üçüncü dalga kahve İstanbul","Kadıköy'de romantik akşam yemeği","Glutensiz kafe Kadıköy","Kadıköy'de tatlıcı önerisi","Kafe menü fiyatları Kadıköy","Hafta sonu kahvaltı rezervasyonu"]),
 etc:C('E-ticaret markası',0,'Burak',"Doğal cilt bakım ürünleri satan bir e-ticaret markasısın, doğru mu?",['E-ticaret','Cilt bakımı','Doğal ürün','Türkiye'],'markalardan','Pazaryeri mağazan','Ürün fiyatları',
  [cp('Doğa Kozmetik','Online · Doğal cilt bakımı'),cp('Pure Skin','Online · Serum, krem'),cp('Botanik Lab','Online · Vegan kozmetik')],
  ["En iyi doğal cilt bakım markası","Türk cilt bakım markaları önerisi","Vegan nemlendirici önerisi","Hassas cilt için serum","Doğal kozmetik nereden alınır","Cilt bakım seti fiyatları","Güvenilir online kozmetik sitesi","C vitamini serumu önerisi","Doğal güneş kremi markası","Kozmetik marka yorumları"]),
 oth:C('Diğer',0,'Burak',"Kadıköy'de hizmet veren bir işletmesin, doğru mu?",['İşletme','Hizmet','Kadıköy'],'işletmelerden','Sektör rehberleri','Fiyatlar',
  [cp('Moda Hizmet','Kadıköy'),cp('Kadıköy Pro','Kadıköy'),cp('İstanbul Uzman','Ataşehir')],
  ["Kadıköy'de en iyi hizmet veren firma","Güvenilir firma önerisi İstanbul","Fiyatlar 2026","Yorumları iyi işletme Kadıköy","Hızlı hizmet veren firma","Kadıköy'de uzman önerisi","Uygun fiyatlı firma","En çok önerilen işletme","Hafta sonu açık firma","Firma yorumları Kadıköy"])
};
var CH=['dis','est','psk','dyt','dok'], CG=['avk','gzl','rst','etc','oth'];
function hs(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function genQ(t,i){var v=function(k){var x=hs(t+k)%10;return x<5?0:x-4>4?(x%3?true:1):x-4}; var q=Q(t,null,v('a'),v('b'),v('c'),v('d')); if(i===0){q.st.gpt=0;q.st.gem=2}return q}
function catQs(c){if(c==='dis')return dentalQs();return CATS[c].qs.map(function(t,i){return genV4(genQ(t,i),i,c)})}
function aud(){return CATS[S.cat]&&CATS[S.cat].h?['Hastalar','hastaların','Hastaların','hastalarından']:['Müşteriler','müşterilerin','Müşterilerin','müşterilerinden']}
function dentalQs(){return [X(Q("Kadıköy'de en iyi diş hekimi","Kadıköy'de en iyi diş hekimi kim?",0,2,0,0),{vol:1900,org:14,c:0,l:[],m:['gpt']}),
  X(Q("İstanbul'da implant için kime gitmeliyim",null,0,3,0,4),{vol:880,org:7,c:0,l:['gam'],m:[]}),
  X(Q("Diş beyazlatma fiyatları Kadıköy",null,2,1,0,3),{vol:590,org:3,c:1,l:['gpt','gam'],m:[]}),
  X(Q("Kadıköy'de zirkonyum kaplama",null,0,2,0,0),{vol:320,org:6,c:2,l:['gem'],m:[]}),
  X(Q("Acil diş hekimi Kadıköy",null,3,1,2,2),{vol:1300,org:2,c:0,l:['gpt','gao','gam'],m:[]}),
  X(Q("İmplant fiyatları 2026",null,0,0,0,0),{vol:2400,org:4,c:0,l:[],m:['gao']}),
  X(Q("Gülüş tasarımı nerede yaptırılır",null,0,4,0,2),{vol:720,org:9,c:2,l:['gam'],m:[]}),
  X(Q("Çocuk diş hekimi Kadıköy",null,0,0,0,0),{vol:480,org:0,c:1,l:[],m:[]}),
  X(Q("Diş teli şeffaf plak",null,0,3,0,0),{vol:1600,org:22,c:1,l:[],m:[]}),
  X(Q("Ağrısız diş çekimi",null,2,1,1,3),{vol:390,org:5,c:0,l:['gao','gam'],m:[]})]}
function defaults(){return {site:'doktorburak.com', cat:'dis', onboarded:false, compsTouched:false, done:{},
 comps:CATS.dis.comps.map(function(c){return {n:c.n,d:c.d}}), qs:dentalQs()}}
var S; try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){} if(!S||!S.qs||!S.cat) S=defaults();
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
function addQ(after){var t=window.prompt(aud()[2]+' AI\'a soracağı yeni soru:', '');if(t&&t.trim()){S.qs.push({t:t.trim(),ask:null,st:null,nw:true});save();after&&after();toast('Soru eklendi')}}
/* ---------- 05 scan ---------- */
var scanRAF=null,scanTO=null,scanDone=false;
function scanRow(k,state,pct){var s=state==='done'?'Tamamlandı':state==='run'?pn(k)+' taranıyor…':'Bekliyor';
 var r=state==='done'?'<span class="tick" style="background:var(--teal)">'+OK+'</span>':state==='run'?'<span class="chip c-g">%'+pct+'</span>':'<span class="small">Sırada</span>';
 return '<div class="card" style="padding:8px 14px"><div class="row"><span class="badge s b-'+k+'">'+P[k].a+'</span><div style="flex:1"><b style="font-size:16px">'+pn(k)+'</b><div class="small">'+s+'</div></div>'+r+'</div><div class="bar" style="margin-top:6px;height:6px"><i style="width:'+(state==='done'?100:state==='run'?pct:0)+'%;background:var(--teal)"></i></div></div>'}
function drawScan(p){var tot=S.qs.length*10;$('#ringN').textContent=Math.round(p*tot);$('#ringT').textContent='/ '+tot+' soru';
 $('#ring').style.background='conic-gradient(var(--teal) 0 '+(p*100)+'%,rgba(255,255,255,.6) '+(p*100)+'% 100%)';
 $('#scanList').innerHTML=PK.map(function(k,i){var lp=Math.max(0,Math.min(1,p*PK.length-i));return scanRow(k,lp>=1?'done':lp>0?'run':'wait',Math.round(lp*100))}).join('')+LKROW}
var LKROW='<div class="card locked" style="padding:8px 14px"><div class="row"><span class="badge s b-cla lockd">Cl</span><span class="badge s b-grk lockd" style="margin-left:-20px">Gk</span><div style="flex:1"><b style="font-size:16px;color:var(--navy2)">Claude · Grok</b><div class="small">Standart\'ta açılır</div></div><span class="lkchip">'+LOCK+' Kilitli</span></div></div>';
function startScan(){stopScan();scanDone=false;var b=$('#scanBtn');b.textContent='Kapat, bildirim bekle';b.className='btn ghost';var t0=performance.now(),D=4000;
 (function step(t){var p=Math.min(1,(t-t0)/D);drawScan(p);if(p<1)scanRAF=requestAnimationFrame(step);else{scanDone=true;b.textContent='Sonuçları gör';b.className='btn';scanTO=setTimeout(function(){if(cur==='s05'){enterMain();setTimeout(banner,450)}},900)}})(t0)}
function stopScan(){cancelAnimationFrame(scanRAF);clearTimeout(scanTO)}
/* ---------- Sorular list ---------- */
var filt='',curQ=0,heroP=null;
function rQList(){
 var n=S.qs.length;$('#qlSub').textContent=n+' konu · '+PK.length+' platform · her hafta ölçülür';
 $('#pfil').innerHTML=[['','Tümü']].concat(PK.map(function(k){return [k,P[k].n]})).map(function(x){return '<span class="chip c-n'+(filt===x[0]?' on':'')+'" data-pf="'+x[0]+'">'+x[1]+'</span>'}).join('')+LK.map(function(k){return '<span class="chip c-n lockc" data-act="locked" data-lk="'+k+'">'+LOCK+' '+P[k].n+'</span>'}).join('');
 var ord=S.qs.map(function(q,i){return i});if(SORT==='vol')ord.sort(function(a,b){return (S.qs[b].vol||0)-(S.qs[a].vol||0)||a-b});
 $('#sortBtn').textContent='Sırala: '+(SORT==='vol'?'Önem':'Eklenme')+' ▾';$('#sortNote').textContent=SORT==='vol'?'Öneme göre sıralı · aylık Google araması':'Eklenme sırasına göre';
 $('#qList').innerHTML=ord.map(function(i){var q=S.qs[i];
  var right,pl;
  if(!q.st){pl='<span class="small">Bir sonraki taramada ölçülecek</span>';right='<span class="chip c-y">Ölçülüyor</span>'}
  else{pl=PK.map(function(k){return '<span class="badge xs b-'+k+(rec(q.st[k])?'':' off')+'" title="'+P[k].n+'">'+P[k].a+'</span>'}).join('');
   if(filt){var v=q.st[filt];right='<span class="chip '+(rec(v)?'c-g':'c-r')+'">'+stTxt(v)+'</span>'}
   else{var c=PK.filter(function(k){return rec(q.st[k])}).length;right='<span class="chip '+(c>=3?'c-g':c>=1?'c-y':'c-r')+'">'+PK.length+'\'te '+c+'</span>'}}
  return '<div class="qi" data-q="'+i+'"><div style="flex:1;min-width:0"><div class="t">'+esc(q.t)+'</div><div class="vrow">'+volPill(q)+'</div><div class="pl">'+pl+'</div></div>'+right+CHEV+'</div>'}).join('')||'<div class="qi"><span class="small">Takip edilen soru yok.</span></div>';
}
/* ---------- 07 question detail ---------- */
function rDetail(){
 var q=S.qs[curQ]||S.qs[0]; if(!q)return; var st=q.st;
 $('#qdTitle').textContent='“'+(q.ask||q.t)+'”';
 $('#qdMeta').innerHTML=volPill(q)+(q.org?'<span class="vp">Google: '+q.org+'. sıra</span>':'<span class="vp">Google: ilk 20 dışında</span>');
 var k=heroP||filt||(PK.filter(function(x){return !rec(st[x])})[0])||'gpt'; heroP=k;
 var a=(S.comps[0]||{n:'Moda Diş Kliniği'}).n,b=(S.comps[1]||{n:'Dt. Selin Aydın'}).n, v=st[k], nm=pn(k);
 var badge='<span class="gp"><span class="badge xs b-'+k+'">'+P[k].a+'</span> '+nm+'</span>';
 var h;
 if(!rec(v)) h='<div class="hl red" style="margin-top:12px;padding:16px 18px"><div class="row" style="justify-content:space-between;margin-bottom:10px">'+badge+'<span class="gp">✕ Önerilmedin</span></div><p style="font-size:17px;line-height:22px;font-weight:600;letter-spacing:-.3px"><b>'+nm+' seni önermedi;</b> yerine <b>'+esc(a)+'</b> ve <b>'+esc(b)+'</b>\'ı önerdi.</p><div class="gbox" style="margin-top:12px;padding:10px 14px"><p style="font-size:13px;line-height:18px;color:#fff;font-style:italic">“Kadıköy\'de öne çıkan seçenekler arasında '+esc(a)+' ve '+esc(b)+' sıkça olumlu yorum alıyor…”</p><p style="font-size:11px;color:rgba(255,255,255,.8);margin-top:4px">Örnek AI cevabı · 27 Eki</p></div></div>';
 else h='<div class="hl teal" style="margin-top:12px;padding:16px 18px"><div class="row" style="justify-content:space-between;margin-bottom:10px">'+badge+'<span class="gp">✓ '+(v===true?'Önerildin':v+'. sıradasın')+'</span></div><p style="font-size:17px;line-height:22px;font-weight:600;letter-spacing:-.3px"><b>'+nm+' seni '+(v===true?'önerdi':v+'. sırada önerdi')+'.</b> '+(v===1?'Bu soruda zirvedesin.':'Önünde <b>'+esc(a)+'</b> var.')+'</p><div class="gbox" style="margin-top:12px;padding:10px 14px"><p style="font-size:13px;line-height:18px;color:#fff;font-style:italic">“…'+esc(CATS[S.cat].who)+' ('+esc(S.site)+') '+esc(CATS[S.cat].tags.slice(1,3).join(' ve ').toLocaleLowerCase('tr-TR'))+' konusunda '+aud()[3]+' olumlu yorumlar alıyor…”</p><p style="font-size:11px;color:rgba(255,255,255,.8);margin-top:4px">Örnek AI cevabı · 27 Eki</p></div></div>';
 $('#qdHero').innerHTML=h;
 $('#qdList').innerHTML=PK.map(function(x){var r=rec(st[x]);return '<div class="item" data-hp="'+x+'" style="padding:7px 0'+(x===k?';background:rgba(0,196,154,.07);margin:0 -16px;padding:7px 16px':'')+'"><span class="badge xs b-'+x+'">'+P[x].a+'</span><div style="flex:1;min-width:0"><b style="font-size:15px">'+pn(x)+'</b><div class="nl"><span class="'+(named(q,x)?'y':'n')+'">'+(named(q,x)?'✓':'✕')+' İsim geçti</span><span class="'+(linked(q,x)?'y':'n')+'">'+(linked(q,x)?'✓':'✕')+' Link verildi</span></div></div><span class="small" style="color:var(--navy2);font-weight:600">'+stTxt(st[x])+'</span><span class="tick" style="background:var(--'+(r?'teal':'red')+')">'+(r?OK:NO)+'</span></div>'}).join('')+LK.map(function(x){return '<div class="item" data-act="locked" data-lk="'+x+'" style="padding:7px 0"><span class="badge xs b-'+x+' lockd">'+P[x].a+'</span><b style="font-size:15px;flex:1;color:var(--navy2)">'+P[x].n+'</b><span class="lkchip">'+LOCK+' Standart\'ta açılır</span></div>'}).join('');
}
/* ---------- v4: search volume, name vs source, prioritised actions ---------- */
function X(q,o){for(var k in o)q[k]=o[k];return q}
var VB=[10,20,30,40,50,70,90,110,140,170,210,260,320,390,480,590,720,880,1000,1300,1600,1900,2400,2900,3600,4400,5400,6600,8100,9900];
function bucket(v){var b=VB[0];VB.forEach(function(x){if(Math.abs(x-v)<Math.abs(b-v))b=x});return b}
var CV={dis:1,est:.9,psk:.7,dyt:.8,dok:.6,avk:1.2,gzl:.9,rst:1.5,etc:1.8,oth:.35};
var SRC={dis:['Doktortakvimi','Google Haritalar','Şikayetvar','Hürriyet Sağlık'],est:['Doktortakvimi','Google Haritalar','Instagram','Şikayetvar'],psk:['Doktortakvimi','Google Haritalar','Psikoloji blogları','Ekşi Sözlük'],dyt:['Doktortakvimi','Google Haritalar','Instagram','Ekşi Sözlük'],dok:['Doktortakvimi','Google Haritalar','Şikayetvar','Sağlık haber siteleri'],
 avk:['Google Haritalar','Hukuk haber siteleri','Ekşi Sözlük','Şikayetvar'],gzl:['Google Haritalar','Instagram','Şikayetvar','Randevu siteleri'],rst:['Google Haritalar','TripAdvisor','Instagram','Yemek blogları'],etc:['Trendyol','Şikayetvar','Ekşi Sözlük','Kozmetik blogları'],oth:['Google Haritalar','Şikayetvar','Ekşi Sözlük','Sektör rehberleri']};
var GAPS=['fiyat aralığı ve sık sorulan sorular','uzmanlık, deneyim ve sertifikalar','güncel yorumlar ve örnek çalışmalar','konum, çalışma saatleri ve iletişim'];
function genV4(q,i,c){var h=hs(q.t+'v');var base=[2400,1300,880,720,590,480,390,320,210,140][i]||200;
 q.vol=bucket(base*CV[c]*(.6+(h%80)/100));q.org=(h%5===0)?0:1+(h>>3)%18;q.c=i%3;
 q.l=PK.filter(function(k){return rec(q.st[k])&&(hs(q.t+k+'l')%3!==0)});q.m=PK.filter(function(k){return !rec(q.st[k])&&hs(q.t+k+'m')%5===0});
 if(i===0){q.org=14;q.st.gao=0;q.st.gam=0;q.l=[];q.m=[]}return q}
function fmtV(v){return '~'+Number(v).toLocaleString('tr-TR')+'/ay'}
function lvl(v){return v>=1000?['Yüksek','c-g']:v>=300?['Orta','c-y']:['Düşük','c-n']}
function volPill(q){if(!q.vol)return '<span class="vp">Hacim ölçülüyor</span>';var L=lvl(q.vol);return '<span class="vp '+L[1]+'"><i></i>'+L[0]+' · '+fmtV(q.vol)+'</span>'}
function named(q,k){return rec(q.st[k])||(q.m||[]).indexOf(k)>=0}
function linked(q,k){return (q.l||[]).indexOf(k)>=0}
function metrics(){var W=0,v=0,n=0,l=0,pp={};PK.forEach(function(k){pp[k]=0});
 S.qs.forEach(function(q){if(!q.st||!q.vol)return;W+=q.vol;PK.forEach(function(k){if(rec(q.st[k])){v+=q.vol;pp[k]+=q.vol}if(named(q,k))n+=q.vol;if(linked(q,k))l+=q.vol})});
 var d=W*PK.length||1;var r={vis:Math.round(v*100/d),name:Math.round(n*100/d),link:Math.round(l*100/d),p:{}};PK.forEach(function(k){r.p[k]=W?Math.round(pp[k]*100/W):0});return r}
function todos(){var out=[];S.qs.forEach(function(q,i){if(!q.st||!q.vol)return;var s=q.st,gg=rec(s.gao)||rec(s.gam),miss=!rec(s.gpt)||!rec(s.gem);if(!miss)return;
  var t=gg?'y':(q.org&&q.org<=10?'g':'r');out.push({t:t,q:q,i:i})});
 var o={r:0,y:1,g:2};out.sort(function(a,b){return o[a.t]-o[b.t]||b.q.vol-a.q.vol});return out}
function rHome(){var m=metrics(),prev=Math.max(0,m.vis-4);
 $('#visN').textContent='%'+m.vis;$('#visK').textContent=m.vis;$('#visPrev').textContent='Geçen hafta %'+prev;$('#visD').textContent='▲ +'+(m.vis-prev)+' bu hafta';
 $('#visRing').style.background='conic-gradient(#fff 0 '+m.vis+'%,rgba(255,255,255,.18) '+m.vis+'% 100%)';
 $('#msName').textContent='%'+m.name;$('#msLink').textContent='%'+m.link;
 PK.forEach(function(k){var x=m.p[k];$('#pv-'+k).textContent='%'+x+' görünürlük';$('#pc-'+k).innerHTML=x>=40?'<span class="chip c-g"><span class="dot d-g"></span>İyi</span>':x>=20?'<span class="chip c-y"><span class="dot d-y"></span>Orta</span>':'<span class="chip c-r"><span class="dot d-r"></span>Zayıf</span>'});
 var T=todos(),red=T.filter(function(x){return x.t==='r'&&!S.done[x.q.t]}).length;$('#todoRed').textContent=red;$('#todoSub').textContent=red?red+' acil adım: rakip var, sen yoksun':'Acil adım yok · '+T.length+' öneri';
 $('#todoRed').style.background=red?'linear-gradient(145deg,#FF7A7A,#E5484D)':'var(--g-hero)';$('#todoRed').textContent=red||'✓';
 $('#bannerT').textContent='Her 100 aramadan '+m.vis+' tanesinde öneriliyorsun (örnek)';setT('.vPrev','%'+prev);setT('.vNow','%'+m.vis);
 var tb=$('.gt[data-tab=s09]');if(tb){var bd=tb.querySelector('.tbadge');if(!bd){bd=document.createElement('em');bd.className='tbadge';tb.appendChild(bd)}bd.textContent=red;bd.style.display=red?'':'none'}}
var TF='';
var TL={r:['🔴','Rakip var, sen yoksun','red'],y:['🟡','Google AI\'da var, ChatGPT/Gemini\'de yok','yel'],g:['🟢','Google\'da ilk 10\'dasın, AI henüz almıyor','grn']};
function srcs(q){var s=SRC[S.cat]||SRC.oth,h=hs(q.t);return [s[h%4],s[(h+1)%4],s[(h+2)%4]]}
function todoCard(x){var q=x.q,c=CATS[S.cat],cn=(S.comps[q.c||0]||c.comps[q.c||0]||{n:'Rakip'}).n,L=TL[x.t],done=S.done[q.t],body,step;
 var miss=['gpt','gem'].filter(function(k){return !rec(q.st[k])}).map(function(k){return P[k].n}).join(' ve ');
 if(x.t==='r'){body='<p class="tx"><b>'+esc(cn)+'</b> öneriliyor; '+miss+' seni önermiyor.</p><div class="qt">“'+esc(q.t)+' denince öne çıkan isimlerden biri '+esc(cn)+'; yorumlarda ilgili ve deneyimli bulunuyor…”</div><div class="small sl">Yapay zekânın kaynak gösterdiği yerler</div><div class="srcs">'+srcs(q).map(function(s){return '<span class="chip c-n">'+esc(s)+'</span>'}).join('')+'</div>';
  step='Bu sitelerde yer al: profilini aç ya da güncelle, '+aud()[1]+' yorum iste; haber ve blog yazarlarıyla iletişime geç (PR hedefi).'}
 else if(x.t==='y'){var gs=['gao','gam'].filter(function(k){return rec(q.st[k])}).map(function(k){return P[k].n}).join(' ve ');
  body='<p class="tx">Google '+gs+' seni öneriyor, <b>'+miss+'</b> önermiyor. Google sana zaten güveniyor.</p>';
  step='Bu güveni taşı: siteni Bing Webmaster Tools\'a ekle (ChatGPT Bing\'i kullanır), Google\'daki güçlü sayfanı güncel tut ve rehber profillerindeki bilgileri sitendekiyle aynı yap.'}
 else {body='<p class="tx">Google\'da <b>'+q.org+'. sıradasın</b>, ama '+miss+' bu soruda sayfanı kaynak almıyor.</p><div class="small sl">Eksik görünen: '+GAPS[hs(q.t)%4]+'</div>';
  step='Sayfana bu soruya doğrudan cevap veren kısa bir bölüm ekle: 3-5 soru-cevap, net bilgiler ve güncel tarih.'}
 return '<div class="card td '+L[2]+'"><div class="row" style="gap:6px;flex-wrap:wrap"><span class="tg '+L[2]+'">'+L[0]+' '+L[1]+'</span></div><b class="tq">“'+esc(q.t)+'”</b><div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">'+volPill(q)+(q.org?'<span class="vp">Google: '+q.org+'. sıra</span>':'<span class="vp">Google: ilk 20 dışında</span>')+'</div>'+body+'<div class="stp"><b>Adım:</b> '+step+'</div><div class="row" style="justify-content:space-between;margin-top:10px"><a class="small lnk" data-q="'+x.i+'">Soruyu aç ›</a><button class="btn sm'+(done?' done-btn':'')+'" data-act="do" data-k="'+esc(q.t)+'">'+(done?'✓ Yapıldı':'Yaptım')+'</button></div></div>'}
function rTodo(){var T=todos(),cnt={r:0,y:0,g:0};T.forEach(function(x){cnt[x.t]++});
 $('#tfil').innerHTML=[['','Tümü',T.length],['r','🔴 Kırmızı',cnt.r],['y','🟡 Sarı',cnt.y],['g','🟢 Yeşil',cnt.g]].map(function(f){return '<span class="chip c-n'+(TF===f[0]?' on':'')+'" data-act="tf" data-f="'+f[0]+'">'+f[1]+' <b style="opacity:.6;margin-left:3px">'+f[2]+'</b></span>'}).join('');
 var h='',last='';T.filter(function(x){return !TF||x.t===TF}).forEach(function(x){if(x.t!==last){last=x.t;h+='<div class="tgh '+TL[x.t][2]+'">'+TL[x.t][0]+' '+TL[x.t][1]+'</div>'}h+=todoCard(x)});
 $('#todoList').innerHTML=h||'<div class="card"><span class="small">Bu grupta öneri yok.</span></div>'}
function rRank(){var m=metrics(),c=CATS[S.cat],cl=function(x){return Math.max(2,Math.min(95,x))},cr=[[cl(m.name+13),cl(m.link+17)],[cl(m.name+4),cl(m.link+3)],[cl(m.name-24),cl(m.link-9)]];
 var rows=[0,1,2].map(function(i){return {n:(S.comps[i]||c.comps[i]||{n:'Rakip'}).n,a:cr[i][0],b:cr[i][1]}});rows.push({n:'Sen',a:m.name,b:m.link,me:1});rows.sort(function(x,y){return y.a-x.a});
 $('#rankList').innerHTML=rows.map(function(r,i){return '<div class="item rkr'+(r.me?' me':'')+'"><div class="av" style="width:30px;height:30px;border-radius:15px">'+(i+1)+'</div><b style="flex:1;min-width:0;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.n)+'</b><span class="c">%'+r.a+'</span><span class="c">%'+r.b+'</span></div>'}).join('')}
var SORT='vol';

var RENDER={s06:rHome,s08:rRank,s09:rTodo,s03:rComps,s04:rChips,sQ:rQList,s07:rDetail,s02:function(){$('#siteIn').value=S.site}};
function syncSite(){$$('.siteName').forEach(function(e){e.textContent=S.site});syncCat();rHome()}
function setT(sel,v){$$(sel).forEach(function(e){e.textContent=v})}
function syncCat(){var c=CATS[S.cat]||CATS.dis,a=aud();
 setT('.catName',c.n);setT('.who',c.who);setT('.audP',a[0]);setT('.audG',a[1]);setT('.compNoun',c.noun);setT('.dir',c.dir);setT('.priceQ',c.priceQ);
 $('#catDesc').textContent=c.desc;$('#catTags').innerHTML=c.tags.map(function(t){return '<span class="gp">'+esc(t)+'</span>'}).join('');
 for(var i=0;i<3;i++)setT('.cn'+i,(S.comps[i]||c.comps[i]).n);
 setT('.q1',(S.qs[1]||{t:c.qs?c.qs[1]:"İstanbul'da implant için kime gitmeliyim"}).t);}
function catRow(k){return '<div class="item'+(S.cat===k?' on':'')+'" data-act="cat-pick" data-c="'+k+'"><b style="font-size:16px">'+esc(CATS[k].n)+'</b><span class="ck">'+(S.cat===k?OK:'')+'</span></div>'}
function catSheet(on){if(on){$('#catH').innerHTML=CH.map(catRow).join('');$('#catG').innerHTML=CG.map(catRow).join('')}$('#catSheet').classList.toggle('on',on)}
function pickCat(k){if(!CATS[k])return;var ch=k!==S.cat;S.cat=k;if(ch){S.qs=catQs(k);S.comps=CATS[k].comps.map(function(c){return {n:c.n,d:c.d}});S.compsTouched=false;S.done={}}save();syncSite();catSheet(true);setTimeout(function(){catSheet(false);if(ch)toast('Soru önerileri “'+CATS[k].n+'” için güncellendi')},260)}
/* ---------- 09 actions ---------- */
function rDone(){}

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
  case 'add-comp':var nm=window.prompt('Rakip adı (kişi, işletme ya da marka):','');if(nm&&nm.trim()){S.comps.push({n:nm.trim(),d:'Senin eklediğin',nw:true});S.compsTouched=true;save();rComps()}break;
  case 'rm-comp':S.comps.splice(idx,1);S.compsTouched=true;save();rComps();break;
  case 'add-q':addQ(rChips);break;
  case 'add-q-main':addQ(rQList);break;
  case 'rm-q':S.qs.splice(idx,1);save();rChips();break;
  case 'start-scan':if(S.qs.length)go('s05');break;
  case 'skip-scan':if(scanDone){enterMain();setTimeout(banner,450)}else{stopScan();enterMain();toast('Tarama arka planda sürüyor…');setTimeout(banner,2200)}break;
  case 'settings':sheet(true);break;
  case 'close-sheet':sheet(false);break;
  case 'cat-open':catSheet(true);break;
  case 'cat-close':catSheet(false);break;
  case 'cat-pick':pickCat(el.getAttribute('data-c'));break;
  case 'locked':toast('Claude ve Grok Standart pakette açılır');break;
  case 'reset':try{localStorage.removeItem(KEY)}catch(x){}S=defaults();sheet(false);catSheet(false);filt='';syncSite();$$('[data-act="do"]').forEach(function(b,i){b.textContent=['Yorum iste','Tamamla','Nasıl?'][i];b.classList.remove('done-btn')});$('.gbtn i')&&($('.gbtn i').style.display='');stack=['s01'];show('s01','fade');break;
  case 'plat':var p=el.getAttribute('data-p')||'';stack=['sQ'];filt=p;show('sQ','fade');break;
  case 'period':var o=['Son 7 gün ▾','Son 30 gün ▾','Son 90 gün ▾'];el.textContent=o[(o.indexOf(el.textContent)+1)%3];toast('Prototipte veriler örnek, dönem değişmez');break;
  case 'do':var dk=el.getAttribute('data-k');if(!S.done[dk]){S.done[dk]=1;save();rTodo();rHome();toast('Harika! Etkisini bir sonraki taramada göreceğiz.')}break;
  case 'tf':TF=el.getAttribute('data-f')||'';rTodo();break;
  case 'sort':SORT=SORT==='vol'?'add':'vol';rQList();break;
  case 'ms-info':toast(el.getAttribute('data-m')==='name'?'Adın geçiyor: yapay zekâ seni biliyor ve cevapta adını anıyor':'Siten kaynak: yapay zekâ sitene güveniyor ve link veriyor');break;
  case 'open-ntf':openNtf();break;
  case 'close-ntf':closeNtf();break;
  case 'banner':$('#banner').classList.remove('on');break;
 }
});
$('#sheet').addEventListener('click',function(e){if(e.target.id==='sheet')sheet(false)});
$('#catSheet').addEventListener('click',function(e){if(e.target.id==='catSheet')catSheet(false)});
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
window.__proto={go:go,tab:tab,cats:CATS,state:function(){return S},cur:function(){return cur}};
})();
