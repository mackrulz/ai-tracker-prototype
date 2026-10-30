from playwright.sync_api import sync_playwright
import os,sys
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','shots',os.environ.get('SHOTS',''),'')
os.makedirs(D,exist_ok=True)
URL='http://127.0.0.1:8765/' if len(sys.argv)<2 else sys.argv[1]
errs=[]
with sync_playwright() as p:
    dev=dict(p.devices['iPhone 14']); dev.pop('default_browser_type',None)
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx=b.new_context(**dev); pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append('console:'+m.text) if m.type=='error' else None)
    pg.on('dialog',lambda d:d.accept(d.message.startswith('Rakip') and 'Dt. Mert Kaya' or 'Kadıköy diş kliniği yorumları'))
    pg.goto(URL); pg.wait_for_timeout(600)
    cur=lambda: pg.evaluate('__proto.cur()')
    def shot(n): pg.wait_for_timeout(450); pg.screenshot(path=D+n+'.png')
    assert cur()=='s01',cur(); assert 'Perplexity' not in pg.content(); t1=pg.inner_text('#s01'); assert all(x in t1 for x in ['ChatGPT','Gemini','AI Overviews','AI Mode','Claude','Grok','Standart']), t1; assert 'müşterilerine' in t1 and 'hasta' not in t1.lower(); shot('01-karsilama')
    pg.click('#s01 [data-go=s02]'); pg.wait_for_timeout(400); assert cur()=='s02'
    pg.click('#s02 [data-act=edit-site]'); pg.fill('#siteIn','doktorburak.com'); pg.click('#s02 [data-act=edit-site]')
    assert 'Diş hekimi olarak algıladık' in pg.inner_text('#s02'); assert pg.locator('#catTags .gp').count()==4
    shot('02-site-algilama')
    pg.click('#catChg'); pg.wait_for_timeout(450); assert pg.is_visible('#catSheet .sheet'); assert pg.locator('#catH .item').count()==5 and pg.locator('#catG .item').count()==5
    assert 'on' in pg.get_attribute('#catH [data-c=dis]','class'); shot('02b-kategori-sec')
    pg.click('#catG [data-c=avk]'); pg.wait_for_timeout(700); assert 'Avukat olarak algıladık' in pg.inner_text('#s02'), pg.inner_text('#s02')
    pg.click('#s02 [data-go=s03]'); pg.wait_for_timeout(400); assert 'Zeynep' in pg.inner_text('#compList')
    pg.click('#s03 [data-go=s04]'); pg.wait_for_timeout(400); t4=pg.inner_text('#s04'); assert "Müşteriler AI'a" in t4 and 'boşanma avukatı' in t4, t4
    vv=pg.evaluate('__proto.state().qs.map(q=>q.vol)'); assert all(10<=v<=9900 for v in vv) and len(set(vv))>3, vv
    pg.click('#s04 .back'); pg.wait_for_timeout(400); pg.click('#s03 .back'); pg.wait_for_timeout(400); assert cur()=='s02'
    pg.click('#catChg'); pg.wait_for_timeout(450); pg.click('#catH [data-c=dis]'); pg.wait_for_timeout(700)
    assert 'Diş hekimi olarak algıladık' in pg.inner_text('#s02')
    pg.click('#s02 [data-go=s03]'); pg.wait_for_timeout(400); assert cur()=='s03'
    pg.click('#compList [data-act=rm-comp][data-i="2"]'); assert pg.locator('#compList .item').count()==2
    pg.click('#s03 [data-act=add-comp]'); assert pg.locator('#compList .item').count()==3
    assert 'Mert Kaya' in pg.inner_text('#compList'); shot('03-rakipler')
    pg.click('#s03 .back'); pg.wait_for_timeout(400); assert cur()=='s02'
    pg.click('#s02 [data-go=s03]'); pg.wait_for_timeout(400)
    pg.click('#s03 [data-go=s04]'); pg.wait_for_timeout(400); assert cur()=='s04'
    pg.click('#chipWrap [data-act=rm-q][data-i="9"]'); assert pg.locator('#chipWrap .chipq').count()==9
    pg.click('#s04 [data-act=add-q]'); assert pg.locator('#chipWrap .chipq').count()==10
    assert '100 soru' in pg.inner_text('#qFoot'); t4=pg.inner_text('#s04'); assert "Hastalar AI'a" in t4 and '4 platformda' in t4; shot('04-sorular')
    pg.click('#s04 [data-act=start-scan]'); pg.wait_for_timeout(2000); assert cur()=='s05'; assert pg.locator('#scanList .card').count()==5 and pg.locator('#scanList .card.locked').count()==1; assert 'Standart' in pg.inner_text('#scanList'); pg.screenshot(path=D+'05-tarama.png')
    pg.wait_for_timeout(3600); assert cur()=='s06',cur(); assert pg.locator('#s06 [data-act=plat][data-p]:not([data-p=""])').count()==4; t6=pg.inner_text('#s06'); assert all(x in t6 for x in ['AI Overviews','AI Mode','Claude ve Grok',"Standart'ta açılır"]), t6; pg.wait_for_timeout(4300); shot('06-ana-ekran')
    pg.click('.gt[data-tab=sQ]'); pg.wait_for_timeout(400); assert cur()=='sQ'
    t6=pg.text_content('#s06'); assert 'Arama hacmine göre ağırlıklı' in t6 and 'Adın geçiyor' in t6 and 'Siten kaynak' in t6, t6
    assert pg.text_content('#todoRed')=='3', pg.text_content('#todoRed'); assert pg.text_content('.gt[data-tab=s09] .tbadge')=='3'
    import re as _re; assert _re.fullmatch(r'%\d+',pg.text_content('#msName')) and _re.fullmatch(r'%\d+',pg.text_content('#msLink')) and _re.fullmatch(r'%\d+',pg.text_content('#visN'))
    assert int(pg.text_content('#msName')[1:])>=int(pg.text_content('#visN')[1:])>=int(pg.text_content('#msLink')[1:])
    assert 'Ölçülüyor' in pg.inner_text('#qList')
    ts=pg.locator('#qList .qi .t').all_inner_texts(); assert ts[0]=='İmplant fiyatları 2026' and ts[1]=="Kadıköy'de en iyi diş hekimi", ts
    assert 'Yüksek · ~2.400/ay' in pg.inner_text('#qList') and 'Hacim ölçülüyor' in pg.inner_text('#qList')
    pg.click('#sortBtn'); assert pg.locator('#qList .qi .t').first.inner_text()=="Kadıköy'de en iyi diş hekimi"; pg.click('#sortBtn'); assert pg.locator('#qList .qi .t').first.inner_text()=='İmplant fiyatları 2026'
    shot('sQ-sorular-listesi')
    pg.click('#qList [data-q="0"]'); pg.wait_for_timeout(400); assert cur()=='s07'
    assert 'önermedi' in pg.inner_text('#qdHero'); tq=pg.inner_text('#qdList'); assert tq.count('İsim geçti')==4 and tq.count('Link verildi')==4; assert '~1.900/ay' in pg.inner_text('#qdMeta') and '14. sıra' in pg.inner_text('#qdMeta'); shot('07-soru-detayi')
    assert pg.locator('#qdList .item').count()==6 and pg.locator('#qdList [data-act=locked]').count()==2; pg.click('#qdList [data-hp=gam]'); assert 'AI Mode' in pg.inner_text('#qdHero'); pg.click('#qdList [data-hp=gem]'); assert '2. sırada' in pg.inner_text('#qdHero')
    pg.click('#s07 .back'); pg.wait_for_timeout(400); assert cur()=='sQ'
    assert pg.locator('#pfil [data-pf]').count()==5 and pg.locator('#pfil .lockc').count()==2; pg.click('#pfil [data-pf=gao]'); pg.click('#pfil [data-pf=gpt]'); assert 'Önermedi' in pg.inner_text('#qList')
    pg.click('.gt[data-tab=s08]'); pg.wait_for_timeout(400); assert cur()=='s08'; assert pg.locator('#rankList .rkr').count()==4 and 'Adı geçiyor' in pg.text_content('#s08') and pg.locator('#rankList .me').count()==1; assert pg.locator('#rankList .rkr').nth(2).get_attribute('class').endswith('me'); shot('08-rakipler')
    pg.click('.gt[data-tab=s09]'); pg.wait_for_timeout(400); assert cur()=='s09'
    assert pg.locator('#tfil .chip').count()==4; assert pg.locator('#todoList .tgh').count()==3
    tg=pg.locator('#todoList .tgh').all_inner_texts(); assert 'Rakip var' in tg[0] and 'Google AI' in tg[1] and 'ilk 10' in tg[2], tg
    assert pg.locator('#todoList .td.red').count()==3 and pg.locator('#todoList .td.yel').count()==2 and pg.locator('#todoList .td.grn').count()==2
    t9=pg.inner_text('#todoList'); assert 'Moda Diş Kliniği' in t9 and 'Doktortakvimi' in t9 and 'Google: 4. sıra' in t9 and 'Adım:' in t9
    shot('09-oneriler')
    pg.click('#tfil [data-f=r]'); assert pg.locator('#todoList .td').count()==3 and pg.locator('#todoList .td.yel').count()==0; shot('09b-oneriler-kirmizi')
    pg.click('#tfil [data-f=g]'); assert pg.locator('#todoList .td').count()==2; pg.click('#tfil [data-f=""]'); assert pg.locator('#todoList .td').count()==7
    pg.click('#s09 [data-act=do] >> nth=1'); assert 'Yapıldı' in pg.inner_text('#s09')
    pg.click('#todoList [data-q] >> nth=0'); pg.wait_for_timeout(400); assert cur()=='s07'; pg.click('#s07 .back'); pg.wait_for_timeout(400); assert cur()=='s09'
    pg.click('.gt[data-tab=s06]'); pg.wait_for_timeout(400); assert pg.text_content('#todoRed')=='2', pg.text_content('#todoRed')
    pg.click('#s06 [data-act=plat][data-p=gao]'); pg.wait_for_timeout(400); assert cur()=='sQ'
    assert 'on' in pg.get_attribute('#pfil [data-pf=gao]','class')
    pg.click('.gt[data-tab=s06]'); pg.wait_for_timeout(400)
    pg.wait_for_timeout(1500); shot('06a-ana-ekran-ust')
    pg.evaluate("document.querySelector('#s06 .content').scrollTop=1e4"); shot('06b-ana-ekran-platformlar')
    pg.evaluate("document.querySelector('#s06 .content').scrollTop=0")
    pg.click('.gbtn'); pg.wait_for_timeout(600); assert pg.is_visible('#s10'); assert 'Grok' not in pg.inner_text('#s10'); shot('10-bildirimler')
    pg.click('#s10 [data-ntf] >> nth=1'); pg.wait_for_timeout(700); assert cur()=='s08' and not pg.is_visible('#s10')
    assert 'Perplexity' not in pg.content() and 'hastalarına' not in pg.content()
    # persistence
    pg.reload(); pg.wait_for_timeout(600); assert cur()=='s06',cur()
    pg.click('#s06 [data-act=settings]'); pg.wait_for_timeout(400); pg.click('#sheet [data-act=reset]'); pg.wait_for_timeout(500); assert cur()=='s01'
    # layout sanity: no horizontal overflow in each screen
    ov=pg.evaluate("""Array.from(document.querySelectorAll('.screen')).map(s=>[s.id,s.scrollWidth,s.clientWidth])""")
    print('overflow', [o for o in ov if o[1]>o[2]])
    # desktop frame
    pg2=b.new_page(viewport={'width':1280,'height':900}); pg2.goto(URL); pg2.wait_for_timeout(600); pg2.screenshot(path=D+'desktop.png')
    b.close()
print('ERRORS',errs); print('ALL PASS')
