# Builds the SPA index.html from the AI Designer glass screens (read-only source).
import re, os
SRC='/workspace/ai-tracker-mobile-glass/html/'
OUT=os.path.dirname(os.path.abspath(__file__))+'/..'
def inner(fn):
    s=open(SRC+fn,encoding='utf-8').read()
    m=re.search(r'<div class="phone"([^>]*)>',s); start=m.end(); phone_attr=m.group(1)
    body=s[start:]
    body=re.sub(r'<div class="sb".*?</span></div>\n?','',body,count=1,flags=re.S)
    for cut in ['<div class="edge"','<div class="hi']:
        i=body.find(cut)
        if i>=0: body=body[:i]
    return body.strip(), phone_attr
def rep(s,a,b,count=1):
    assert a in s, ('missing',a[:80])
    return s.replace(a,b,count)
scr={}
# 01
b,_=inner('01-karsilama.html')
b=rep(b,'<span class="badge xs" style="background:var(--teal)">AI</span><b style="font-size:16px">AI Tracker</b>','<span class="badge xs" style="background:var(--teal)" id="logo">AI</span><b style="font-size:16px" id="logoTxt">AI Tracker</b>')
b=rep(b,'<button class="btn">Başla','<button class="btn" data-go="s02">Başla')
b=rep(b,'<b style="color:var(--teal-d)">Giriş yap</b>','<b style="color:var(--teal-d)" data-toast="Giriş prototipte yok — Başla ile devam et">Giriş yap</b>')
scr['s01']=b
# 02
b,_=inner('02-site-gir.html')
b=rep(b,'<div class="back">','<div class="back" data-back>')
b=re.sub(r'(<div class="input" style="margin-top:20px">(<svg.*?</svg>))doktorburak\.com',r'\1<input id="siteIn" value="doktorburak.com" inputmode="url" autocapitalize="off" autocorrect="off" spellcheck="false" readonly>',b,count=1,flags=re.S)
assert 'siteIn' in b
b=rep(b,'<button class="btn sm white" style="flex:1;height:50px">Evet, doğru','<button class="btn sm white" style="flex:1;height:50px" data-go="s03">Evet, doğru')
b=rep(b,'0 4px 12px -4px rgba(0,0,0,.25)">Düzelt','0 4px 12px -4px rgba(0,0,0,.25)" data-act="edit-site">Düzelt')
b=rep(b,'<b style="font-size:15px">Dt. Burak · doktorburak.com</b>','<b style="font-size:15px">Dt. Burak · <span class="siteName">doktorburak.com</span></b>')
scr['s02']=b
# 03
b,_=inner('03-rakipler.html')
b=rep(b,'<div class="back">','<div class="back" data-back>')
b=rep(b,'<h2 style="margin-top:16px">3 rakip bulduk</h2>','<h2 style="margin-top:16px" id="compTitle">3 rakip bulduk</h2>')
b=re.sub(r'<div class="card list" style="margin-top:20px;padding:4px 16px">.*?</div>\n <button','<div class="card list" style="margin-top:20px;padding:4px 16px" id="compList"></div>\n <button',b,count=1,flags=re.S)
assert 'compList' in b
b=rep(b,'<button class="btn ghost" style="margin-top:12px;color:var(--teal-d)">','<button class="btn ghost" style="margin-top:12px;color:var(--teal-d)" data-act="add-comp">')
b=rep(b,'<button class="btn">Devam et','<button class="btn" data-go="s04">Devam et')
scr['s03']=b
# 04
b,_=inner('04-sorular.html')
b=rep(b,'<div class="back">','<div class="back" data-back>')
b=rep(b,'<p class="sub">Bu 10 konuyu','<p class="sub" id="qSub">Bu 10 konuyu')
b=re.sub(r'<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:16px">.*?\n <div style="display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:20px;border:1.5px dashed',
 '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:16px" id="chipWrap"><span id="chipEnd"></span>\n <div data-act="add-q" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:20px;border:1.5px dashed',b,count=1,flags=re.S)
assert 'chipWrap' in b
b=re.sub(r'<div class="small" style="text-align:center;margin-bottom:12px">.*?</div><button class="btn">Taramayı başlat',
 '<div class="small" style="text-align:center;margin-bottom:12px" id="qFoot"></div><button class="btn" data-act="start-scan">Taramayı başlat',b,count=1,flags=re.S)
assert 'qFoot' in b
scr['s04']=b
# 05: make progress elements addressable
b,_=inner('05-tarama.html')
b=rep(b,'<span class="x" style="width:36px;height:36px;border-radius:18px">','<span class="x" style="width:36px;height:36px;border-radius:18px" data-act="skip-scan">')
b=rep(b,'<div style="width:104px;height:104px;border-radius:52px;background:conic-gradient(var(--teal) 0 58%,rgba(255,255,255,.6) 58% 100%)','<div id="ring" style="width:104px;height:104px;border-radius:52px;background:conic-gradient(var(--teal) 0 0%,rgba(255,255,255,.6) 0% 100%)')
b=rep(b,'<b style="font-size:32px;letter-spacing:-1.2px;font-weight:800">58</b><span class="small" style="font-size:11px">/ 100 soru</span>','<b style="font-size:32px;letter-spacing:-1.2px;font-weight:800" id="ringN">0</b><span class="small" style="font-size:11px" id="ringT">/ 100 soru</span>')
b=re.sub(r'<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">.*?\n </div>\n</div>','<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px" id="scanList"></div>\n</div>',b,count=1,flags=re.S)
assert 'scanList' in b
b=rep(b,'<button class="btn ghost">Kapat, bildirim bekle','<button class="btn ghost" data-act="skip-scan" id="scanBtn">Kapat, bildirim bekle')
scr['s05']=b
# 06
b,_=inner('06-ana-ekran.html')
b=rep(b,'<div class="small" style="font-size:14px">Merhaba Dt. Burak 👋</div><b style="font-size:22px;letter-spacing:-.6px">doktorburak.com</b>','<div class="small" style="font-size:14px">Merhaba Dt. Burak 👋</div><b style="font-size:22px;letter-spacing:-.6px" class="siteName">doktorburak.com</b>')
b=rep(b,'<div class="av" style="width:44px;height:44px;border-radius:22px;background:var(--g-hero);color:#fff">DB</div>','<div class="av" style="width:44px;height:44px;border-radius:22px;background:var(--g-hero);color:#fff;cursor:pointer" data-act="settings" aria-label="Ayarlar">DB</div>')
b=rep(b,'<div class="card row" style="margin-top:12px;padding:14px 18px">','<div class="card row tap" style="margin-top:12px;padding:14px 18px" data-tab="s08">')
b=rep(b,'<a>Tümü</a>','<a data-act="plat" data-p="">Tümü</a>')
for p,name in [('gem','Gemini'),('ppx','Perplexity'),('gpt','ChatGPT'),('gai','Google AI')]:
    b=rep(b,'<div class="card" style="padding:14px"><div class="row" style="justify-content:space-between"><span class="badge s b-%s">'%p,'<div class="card tap" style="padding:14px" data-act="plat" data-p="%s"><div class="row" style="justify-content:space-between"><span class="badge s b-%s">'%(p,p))
b=b.rstrip()
assert b.endswith('</div>')
b=b[:-6]+'<p class="small" style="text-align:center;margin:14px 0 4px;opacity:.8">Sayılar ve klinik adları örnek veridir.</p></div>'
scr['s06']=b
# 07
b,_=inner('07-soru-detayi.html')
b=rep(b,'<div class="back">','<div class="back" data-back>')
b=rep(b,'<h2 style="font-size:25px;line-height:30px;margin-top:4px;letter-spacing:-.7px">','<h2 style="font-size:25px;line-height:30px;margin-top:4px;letter-spacing:-.7px" id="qdTitle">')
b=re.sub(r'<div class="hl red" style="margin-top:12px;padding:16px 18px">.*?\n </div>\n <div class="card list" style="margin-top:10px;padding:0 16px">.*?\n </div>',
 '<div id="qdHero"></div>\n <div class="card list" style="margin-top:10px;padding:0 16px" id="qdList"></div>',b,count=1,flags=re.S)
assert 'qdHero' in b
scr['s07']=b
# 08
b,_=inner('08-rakipler-ses-payi.html')
b=rep(b,'<span class="chip c-n" style="height:32px;padding:0 12px;font-size:13px">Son 7 gün ▾</span>','<span class="chip c-n tap" style="height:32px;padding:0 12px;font-size:13px" data-act="period" id="period">Son 7 gün ▾</span>')
b=b.rstrip()[:-6]+'<p class="small" style="text-align:center;margin:14px 0 4px;opacity:.8">Örnek veri</p></div>'
scr['s08']=b
# 09
b,_=inner('09-ne-yapmaliyim.html')
for t in ['Yorum iste','Tamamla','Nasıl?']:
    b=re.sub(r'<button class="btn sm( white)?">'+re.escape(t),lambda m:'<button class="btn sm%s" data-act="do">%s'%(m.group(1) or '',t),b,count=1)
assert b.count('data-act="do"')==3
scr['s09']=b
# 10
b,attr10=inner('10-bildirimler.html')
b=rep(b,'<div style="font-size:18px;font-weight:600;margin-top:6px;opacity:.9">Perşembe 29 Ekim</div>','<div style="font-size:18px;font-weight:600;margin-top:6px;opacity:.9" id="lsDate">Perşembe 29 Ekim</div>')
b=rep(b,"line-height:108px;letter-spacing:-4px\">9:41</div>","line-height:108px;letter-spacing:-4px\" id=\"lsTime\">9:41</div>")
targets=['s06','s08','s07:0','s06']
i=[0]
def ntf(m):
    t=targets[i[0]]; i[0]+=1
    return m.group(0).replace('<div style="background:rgba(255,255,255,.58)','<div class="tap" data-ntf="%s" style="background:rgba(255,255,255,.58)'%t,1)
b=re.sub(r'<div style="background:rgba\(255,255,255,\.58\);backdrop-filter:blur\(26px\)',ntf,b)
assert i[0]==4, i
# replace flashlight/camera row with close button
b=re.sub(r'<div style="display:flex;justify-content:space-between;padding:0 46px 52px;flex:none">.*$',
 '<div class="ls-foot"><button class="ls-close" data-act="close-ntf">Kapat</button><div class="small" style="color:rgba(255,255,255,.7);margin-top:10px">Bildirimler örnektir · dokununca ilgili ekran açılır</div></div>',b,flags=re.S)
assert 'ls-close' in b
scr['s10']=b
style10=re.search(r'style="(.*)"',attr10).group(1)

# Sorular tab (new screen, same visual language)
scr['sQ']='''<div class="content dockpad" style="padding-top:4px">
 <div class="row" style="justify-content:space-between;height:44px"><h2>Sorular</h2><span class="chip c-n tap" style="height:32px;padding:0 12px;font-size:13px" data-act="add-q-main">+ Soru ekle</span></div>
 <p class="sub" style="margin-top:4px" id="qlSub"></p>
 <div class="pfil" id="pfil"></div>
 <div class="card list" style="margin-top:12px;padding:2px 16px" id="qList"></div>
 <p class="small" style="text-align:center;margin:14px 0 4px;opacity:.8">Sonuçlar örnek veridir.</p>
</div>'''

tpl=open(OUT+'/src/shell.html',encoding='utf-8').read()
dock=open(SRC+'06-ana-ekran.html',encoding='utf-8').read()
dock=dock[dock.find('<div class="dock">'):dock.find('<div class="hi')]
dock=dock.replace('<div class="gt on">','<div class="gt">')
for t,id_ in [('Ana sayfa','s06'),('Sorular','sQ'),('Rakipler','s08'),('Öneriler','s09')]:
    dock=re.sub(r'<div class="gt">(<svg(?:(?!<svg).)*?</svg><span>%s</span>)'%t,r'<div class="gt" data-tab="%s">\1'%id_,dock,count=1,flags=re.S)
dock=dock.replace('<div class="gbtn">','<div class="gbtn" data-act="open-ntf" aria-label="Bildirimler">',1)
assert dock.count('data-tab')==4
sections=[]
for k in ['s01','s02','s03','s04','s05','s06','sQ','s07','s08','s09']:
    sections.append('<section class="screen" id="%s">%s</section>'%(k,scr[k]))
sections.append('<section class="screen lock" id="s10" style="%s">%s</section>'%(style10,scr['s10']))
html=html_fix=None
html=tpl.replace('<!--SCREENS-->','\n'.join(sections)).replace('<!--DOCK-->','<div class="edge" id="edge"></div>'+dock)
html=html.replace("'SFProLocal'","-apple-system,'Inter',system-ui,sans-serif")
open(OUT+'/index.html','w',encoding='utf-8').write(html)
print('ok',len(html))
