from playwright.sync_api import sync_playwright
import os,sys
D=os.path.dirname(os.path.abspath(__file__))+'/../shots/'
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
    assert cur()=='s01',cur(); shot('01-karsilama')
    pg.click('#s01 [data-go=s02]'); pg.wait_for_timeout(400); assert cur()=='s02'
    pg.click('#s02 [data-act=edit-site]'); pg.fill('#siteIn','doktorburak.com'); pg.click('#s02 [data-act=edit-site]')
    shot('02-site')
    pg.click('#s02 [data-go=s03]'); pg.wait_for_timeout(400); assert cur()=='s03'
    pg.click('#compList [data-act=rm-comp][data-i="2"]'); assert pg.locator('#compList .item').count()==2
    pg.click('#s03 [data-act=add-comp]'); assert pg.locator('#compList .item').count()==3
    assert 'Mert Kaya' in pg.inner_text('#compList'); shot('03-rakipler')
    pg.click('#s03 .back'); pg.wait_for_timeout(400); assert cur()=='s02'
    pg.click('#s02 [data-go=s03]'); pg.wait_for_timeout(400)
    pg.click('#s03 [data-go=s04]'); pg.wait_for_timeout(400); assert cur()=='s04'
    pg.click('#chipWrap [data-act=rm-q][data-i="9"]'); assert pg.locator('#chipWrap .chipq').count()==9
    pg.click('#s04 [data-act=add-q]'); assert pg.locator('#chipWrap .chipq').count()==10
    assert '100 soru' in pg.inner_text('#qFoot'); shot('04-sorular')
    pg.click('#s04 [data-act=start-scan]'); pg.wait_for_timeout(2000); assert cur()=='s05'; pg.screenshot(path=D+'05-tarama.png')
    pg.wait_for_timeout(3600); assert cur()=='s06',cur(); shot('06-ana-ekran')
    pg.click('.gt[data-tab=sQ]'); pg.wait_for_timeout(400); assert cur()=='sQ'
    assert 'Ölçülüyor' in pg.inner_text('#qList'); shot('sQ-sorular-listesi')
    pg.click('#qList [data-q="0"]'); pg.wait_for_timeout(400); assert cur()=='s07'
    assert 'önermedi' in pg.inner_text('#qdHero'); shot('07-soru-detayi')
    pg.click('#qdList [data-hp=gem]'); assert '2. sırada' in pg.inner_text('#qdHero')
    pg.click('#s07 .back'); pg.wait_for_timeout(400); assert cur()=='sQ'
    pg.click('#pfil [data-pf=gpt]'); assert 'Önermedi' in pg.inner_text('#qList')
    pg.click('.gt[data-tab=s08]'); pg.wait_for_timeout(400); assert cur()=='s08'; shot('08-rakipler')
    pg.click('.gt[data-tab=s09]'); pg.wait_for_timeout(400); assert cur()=='s09'
    pg.click('#s09 [data-act=do] >> nth=1'); assert 'Yapıldı' in pg.inner_text('#s09'); shot('09-oneriler')
    pg.click('.gt[data-tab=s06]'); pg.wait_for_timeout(400)
    pg.click('#s06 [data-act=plat][data-p=gai]'); pg.wait_for_timeout(400); assert cur()=='sQ'
    assert 'on' in pg.get_attribute('#pfil [data-pf=gai]','class')
    pg.click('.gt[data-tab=s06]'); pg.wait_for_timeout(400)
    pg.click('.gbtn'); pg.wait_for_timeout(600); assert pg.is_visible('#s10'); shot('10-bildirimler')
    pg.click('#s10 [data-ntf] >> nth=1'); pg.wait_for_timeout(700); assert cur()=='s08' and not pg.is_visible('#s10')
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
