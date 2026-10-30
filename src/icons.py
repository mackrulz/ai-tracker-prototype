from playwright.sync_api import sync_playwright
import os
d=os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for size,name in [(512,'icon-512.png'),(192,'icon-192.png'),(180,'apple-touch-icon.png')]:
        pg=b.new_page(viewport={'width':512,'height':512},device_scale_factor=size/512)
        pg.goto('file://'+d+'/icon.html'); pg.wait_for_timeout(200)
        pg.locator('#i').screenshot(path=d+'/../icons/'+name)
    b.close()
