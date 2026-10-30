# v4: search-volume weighting, "Adın geçiyor" vs "Siten kaynak", prioritised "Ne yapmalıyım?" (red/yellow/green).
import re
from v3 import rep, edit
def s06(b):
    b=rep(b,'<div style="position:absolute;inset:0;border-radius:58px;background:conic-gradient(#fff 0 23%','<div id="visRing" style="position:absolute;inset:0;border-radius:58px;background:conic-gradient(#fff 0 23%')
    b=rep(b,"letter-spacing:-2px\">%23</b>","letter-spacing:-2px\" id=\"visN\">%23</b>")
    b=rep(b,"<span class=\"gp\">▲ +4 bu hafta</span>","<span class=\"gp\" id=\"visD\">▲ +4 bu hafta</span>")
    b=rep(b,"""<p style="font-size:22px;line-height:27px;font-weight:700;letter-spacing:-.6px">100 sorunun <span style="color:#C9FFEF">23'ünde</span> öneriliyorsun</p><p style="font-size:13px;opacity:.85;margin-top:6px">Geçen hafta 19'du</p></div>""",
     """<p style="font-size:20px;line-height:25px;font-weight:700;letter-spacing:-.5px">Her 100 aramadan <span style="color:#C9FFEF" id="visK">23</span> tanesinde öneriliyorsun</p><p style="font-size:12px;opacity:.85;margin-top:6px" id="visPrev">Geçen hafta %19</p></div>""")
    # weighted note + two small numbers under the ring
    i=b.index('<div class="card row tap" style="margin-top:12px;padding:14px 18px" data-tab="s08">')
    j=b.rindex('</div>',0,i)  # end of hero
    b=b[:j]+'<div class="ms"><div class="mi tap" data-act="ms-info" data-m="name"><span class="mk">👤</span><div><b id="msName">%0</b><span>Adın geçiyor</span></div></div><div class="mi tap" data-act="ms-info" data-m="link"><span class="mk">🔗</span><div><b id="msLink">%0</b><span>Siten kaynak</span></div></div></div><p class="wnote">⚖︎ Arama hacmine göre ağırlıklı</p>\n '+b[j:]
    # "Ne yapmalıyım" entry with red badge, right after competitor rank row
    k=b.index('</div>',b.index('data-tab="s08">'))
    m=re.search(r'</svg></div>',b[i:]); e=i+m.end()
    b=b[:e]+'\n <div class="card row tap" style="margin-top:10px;padding:14px 18px" data-tab="s09" id="todoEntry"><div class="av" style="background:linear-gradient(145deg,#FF7A7A,#E5484D);color:#fff;font-size:20px;font-weight:800" id="todoRed">0</div><div style="flex:1;min-width:0"><b style="font-size:16px">Ne yapmalıyım?</b><div class="small" id="todoSub">Acil adımlar</div></div><svg width="8" height="14" viewBox="0 0 8 14"><path d="M1.5 1.5L6.5 7l-5 5.5" stroke="#9AA6B8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'+b[e:]
    # dynamic platform cards
    return b
def s08(b):
    b=re.sub(r'<div class="sec-t" style="margin:16px 4px 8px"><h3>Sıralama</h3>.*?</div>\n <div class="card list" style="padding:4px 16px">.*?\n<p class="small"',
      '<div class="sec-t" style="margin:16px 4px 8px"><h3>Sıralama</h3><span class="small">Hacme göre ağırlıklı</span></div>\n <div class="card list rk" style="padding:4px 16px"><div class="rkh"><span style="flex:1">İsim</span><span class="c">Adı geçiyor</span><span class="c">Kaynak</span></div><div id="rankList"></div></div>\n<p class="small"',b,count=1,flags=re.S)
    assert 'rankList' in b
    return b
S09='''<section class="screen" id="s09"><div class="content dockpad" style="padding-top:4px">
 <div style="height:48px;display:flex;align-items:center"><h2>Ne yapmalıyım?</h2></div>
 <p class="sub" style="margin-top:0" id="todoIntro">Önce kırmızılar: en çok aranan sorulardan başladık.</p>
 <div class="pfil" id="tfil"></div>
 <div id="todoList" style="display:flex;flex-direction:column;gap:10px;margin-top:10px"></div>
 <p class="small" style="text-align:center;margin:14px 0 4px;opacity:.8">Öneriler örnek veriye dayanır.</p>
</div></section>'''
def sQ(b):
    return rep(b,'<p class="sub" style="margin-top:4px" id="qlSub"></p>','<p class="sub" style="margin-top:4px" id="qlSub"></p>\n <div class="row" style="justify-content:space-between;margin-top:8px"><span class="small" id="sortNote">Öneme göre sıralı · aylık Google araması</span><span class="chip c-n tap" style="height:30px;padding:0 11px;font-size:12px" data-act="sort" id="sortBtn">Sırala: Önem ▾</span></div>')
def s07(b):
    return rep(b,'id="qdTitle">','id="qdTitle">',1).replace('<div id="qdHero"></div>','<div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap" id="qdMeta"></div>\n <div id="qdHero"></div>',1)
def s10(b):
    b=rep(b,'görünürlüğün %19 → %23.','görünürlüğün <span class="vPrev">%19</span> → <span class="vNow">%23</span>.')
    return b
def v4(html):
    for k,f in [('s06',s06),('s08',s08),('sQ',sQ),('s07',s07),('s10',s10)]:
        html=edit(html,k,f)
    html=edit(html,'s09',lambda b:S09)
    html=rep(html,"<div class=\"small\" style=\"color:var(--navy2)\">100 sorunun 23'ünde öneriliyorsun (örnek)</div>","<div class=\"small\" style=\"color:var(--navy2)\" id=\"bannerT\">Her 100 aramadan 23 tanesinde öneriliyorsun (örnek)</div>")
    assert 'qdMeta' in html
    return html
