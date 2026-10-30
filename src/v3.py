# v3: general positioning, detected business category, 4 starter platforms + locked Claude/Grok.
import re
LOCK='<svg class="lk" width="11" height="13" viewBox="0 0 16 20" fill="none"><rect x="1.5" y="8.5" width="13" height="10" rx="2.5" fill="currentColor"/><path d="M4.5 8.5V6a3.5 3.5 0 017 0v2.5" stroke="currentColor" stroke-width="2.2"/></svg>'
def rep(s,a,b,count=1):
    assert a in s, ('missing',a[:90])
    return s.replace(a,b,count)
def sec(html,id_):
    m=re.search(r'<section class="screen[^"]*" id="%s".*?</section>'%id_,html,flags=re.S); return m
def edit(html,id_,fn):
    m=sec(html,id_); return html[:m.start()]+fn(m.group(0))+html[m.end():]
def orb(pos,k,a,n,extra=''):
    return '<div style="position:absolute;%s" class="card row orb"><span class="badge s b-%s">%s</span><b style="font-size:13px">%s</b>%s</div>'%(pos,k,a,n,extra)
def s01(b):
    b=re.sub(r'  <div style="position:absolute;left:10px;top:14px" class="card row orb">.*?<b style="font-size:13px">Google AI</b></div>\n',
     orb('left:10px;top:14px','gpt','GP','ChatGPT')+'\n'+orb('right:10px;top:14px','gem','Ge','Gemini')+'\n'+
     orb('left:0;top:200px','gao','AO','AI Overviews')+'\n'+orb('right:0;top:200px','gam','AM','AI Mode')+'\n'+
     '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0;white-space:nowrap" class="card row orb lockpill"><span class="badge xs b-cla lockd">Cl</span><span class="badge xs b-grk lockd" style="margin-left:-8px">Gk</span><b style="font-size:12px;color:var(--navy2)">Claude · Grok</b><span class="lkchip">'+LOCK+' Standart</span></div>\n',b,count=1,flags=re.S)
    assert 'b-gao' in b and 'b-gai' not in b
    b=rep(b,'seni hastalarına öneriyor mu?','seni müşterilerine öneriyor mu?')
    return b
def s02(b):
    b=rep(b,' Google Haritalar kaydı eşleşti</div>',' Google Haritalar kaydı eşleşti</div>\n  <div class="row small detect" style="color:var(--navy);margin-top:8px"><span class="tick" style="background:var(--teal)"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span> <span><b class="catName">Diş hekimi</b> olarak algıladık</span><a class="chg" data-act="cat-open" id="catChg">Değiştir</a></div>')
    b=rep(b,'<b style="font-size:15px">Dt. Burak · ','<b style="font-size:15px"><span class="who">Dt. Burak</span> · ')
    b=rep(b,"margin:14px 0 12px\">İmplant ve estetik diş yapan Kadıköy'de bir diş hekimisin, doğru mu?</p>","margin:14px 0 12px\" id=\"catDesc\">İmplant ve estetik diş yapan Kadıköy'de bir diş hekimisin, doğru mu?</p>")
    b=re.sub(r'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">.*?</div>','<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px" id="catTags"></div>',b,count=1,flags=re.S)
    return b
def s03(b):
    return rep(b,"en sık önerdiği kliniklerden seçtik","en sık önerdiği <span class=\"compNoun\">kliniklerden</span> seçtik")
def s04(b):
    b=rep(b,"<h2 style=\"margin-top:16px\">Hastalar AI'a şunları soruyor</h2>","<h2 style=\"margin-top:16px\"><span class=\"audP\">Hastalar</span> AI'a şunları soruyor</h2>")
    return rep(b,'5 platformda','4 platformda')
def s05(b):
    b=rep(b,'Her platforma hastaların sorduğu gibi soruyoruz.','Her platforma <span class="audG">hastaların</span> sorduğu gibi soruyoruz.')
    return b
def comps(b):
    for i,n in enumerate(['Moda Diş Kliniği','Dt. Selin Aydın','Kadıköy Gülüş Merkezi']):
        b=b.replace('>'+n+'<','><span class="cn%d">%s</span><'%(i,n))
        b=re.sub(r'(?<![>"])'+re.escape(n),'<span class="cn%d">%s</span>'%(i,n),b)
    return b
def card(k,a,top,name,n,chip):
    return '<div class="card tap" style="padding:14px" data-act="plat" data-p="%s"><div class="row" style="justify-content:space-between"><span class="badge s b-%s">%s</span>%s</div><div class="small" style="margin-top:8px;font-size:11px;font-weight:700;letter-spacing:.3px">%s</div><b style="font-size:15px;display:block">%s</b><div class="small" style="margin-top:2px">%d soruda öneriyor</div></div>'%(k,k,a,chip,top,name,n)
CH={'g':'<span class="chip c-g"><span class="dot d-g"></span>İyi</span>','y':'<span class="chip c-y"><span class="dot d-y"></span>Orta</span>','r':'<span class="chip c-r"><span class="dot d-r"></span>Zayıf</span>'}
def s06(b):
    b=rep(b,'<div class="small" style="font-size:14px">Merhaba Dt. Burak 👋</div>','<div class="small" style="font-size:14px">Merhaba <span class="who">Dt. Burak</span> 👋</div>')
    grid=('<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">\n  '+
      card('gpt','GP','OPENAI','ChatGPT',23,CH['y'])+card('gem','Ge','GOOGLE','Gemini',41,CH['g'])+
      card('gao','AO','GOOGLE','AI Overviews',11,CH['r'])+card('gam','AM','GOOGLE','AI Mode',29,CH['y'])+
      '<div class="card pwide tap locked" style="padding:14px;grid-column:1 / -1" data-act="locked"><div class="row" style="gap:12px"><span class="badge s b-cla lockd">Cl</span><span class="badge s b-grk lockd" style="margin-left:-20px">Gk</span><div style="flex:1;min-width:0"><b style="font-size:15px;display:block">Claude ve Grok</b><div class="small" style="margin-top:2px">Standart\'ta açılır</div></div><span class="lkchip">'+LOCK+' Kilitli</span></div></div>\n </div>')
    b=re.sub(r'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">.*?\n </div>',lambda m:grid,b,count=1,flags=re.S)
    assert 'data-p="gai"' not in b and 'data-p="gao"' in b
    b=rep(b,'Sayılar ve klinik adları örnek veridir.','Sayılar ve isimler örnek veridir.')
    return comps(b)
def s07(b):
    b=rep(b,'<div class="lbl" style="margin-top:8px">Hastaların sorusu</div>','<div class="lbl" style="margin-top:8px"><span class="audG">Hastaların</span> sorusu</div>')
    b=rep(b,'font-size:11px;height:24px">Doktortakvimi</span>','font-size:11px;height:24px" class="dir">Doktortakvimi</span>')
    return b
def s09(b):
    b=rep(b,'AI, en çok yorumu olan klinikleri öneriyor.','AI, en çok yorumu olan işletmeleri öneriyor.')
    b=rep(b,'>Doktortakvimi profilin eksik<','><span class="dir">Doktortakvimi</span> profilin eksik<')
    b=rep(b,'Gemini ve Claude bilgini buradan alıyor; uzmanlıkların ve fotoğrafların yok.','Gemini ve Google AI bilgini buradan alıyor; hizmetlerin ve fotoğrafların yok.')
    b=rep(b,'🔗 Doktortakvimi<','🔗 <span class="dir">Doktortakvimi</span><')
    b=rep(b,'“İmplant fiyatları” sorularında','“<span class="priceQ">İmplant fiyatları</span>” sorularında')
    return comps(b)
def s10(b):
    b=rep(b,'“İmplant için kime gitmeliyim” sorusunda','“<span class="q1">İmplant için kime gitmeliyim</span>” sorusunda')
    b=rep(b,'Grok’ta ilk kez 3. sıraya çıktın.','Google AI Mode’da ilk kez 3. sıraya çıktın.')
    return comps(b)
def v3(html):
    for k,f in [('s01',s01),('s02',s02),('s03',s03),('s04',s04),('s05',s05),('s06',s06),('s07',s07),('s08',comps),('s09',s09),('s10',s10)]:
        html=edit(html,k,f)
    html=rep(html,"100 sorunun 23'ünde öneriliyorsun (örnek)","100 sorunun 23'ünde öneriliyorsun (örnek)")
    for bad in ['Perplexity','hastalarına','b-gai','data-p="gai"']:
        assert bad not in html,bad
    return html
