const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {fs,path,root,json,hash,write}=require('../tools/common.cjs');
const {serve}=require('../tools/serve.cjs');
async function main(){
  const {server,url}=await serve();const browser=await chromium.launch({channel:'chromium'});
  const report={started:new Date().toISOString(),browser:browser.version(),checks:[],screenshots:[]};
  const runs=json('catalogue.json').experiments[0].runs;
  fs.mkdirSync(path.join(root,'.local/browser'),{recursive:true});
  async function check(name,fn){await fn();report.checks.push(name);console.log('PASS '+name);}
  const context=await browser.newContext({viewport:{width:1440,height:900},permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.stack));
  try{
    await check('home shows real imagery before scrolling and starts no simulation',async()=>{await page.goto(url);const image=page.locator('.feature>img');assert.ok((await image.boundingBox()).y<900);assert.equal(await page.locator('iframe').count(),0);assert.ok(await image.evaluate(i=>i.naturalWidth)>=960);});
    await check('homepage comparison follows the preview and supports selection, source and launch',async()=>{
      assert.deepEqual(await page.locator('main > section').evaluateAll(sections=>sections.map(s=>s.id||'hero')),['hero','results','prompt']);
      assert.equal(await page.getByText('A closer look at the output.',{exact:true}).count(),0);
      assert.equal(await page.locator('.feature .secondary').getAttribute('href'),'#results');
      assert.equal(await page.locator('#results .run-card').count(),10);
      assert.equal(await page.locator('#results [data-pair]:visible').getAttribute('data-pair'),'Ultra');
      await page.locator('[data-effort="Medium"]').click();
      await page.locator('#sol-medium [data-source]').click();await page.waitForFunction(()=>document.getElementById('source-content').textContent.includes('<html'));await page.locator('#source-close').click();
      const trigger=page.locator('#sol-medium [data-play]');await trigger.click();await page.frameLocator('iframe').locator('canvas').first().waitFor({state:'visible'});
      assert.ok(page.url().includes('run=sol-medium'));await page.locator('#viewer-close').click();await page.waitForFunction(()=>!document.querySelector('iframe'));
      assert.equal(await trigger.evaluate(el=>document.activeElement===el),true);
      await page.locator('#sol-medium .run-links a').filter({hasText:'Prompt'}).click();assert.equal(await page.locator('#prompt-run').inputValue(),'sol-medium');assert.ok(await page.locator('#prompt-details').getAttribute('open')!==null);
    });
    await check('context page has no duplicate comparison and legacy result URLs remain usable',async()=>{
      await page.goto(url+'/experiments/cosmic-gravity/#method');assert.equal(await page.locator('[data-pair]').count(),0);assert.ok(await page.getByRole('heading',{name:'Prompt & methodology',exact:true}).isVisible());
      await page.goto(url+'/experiments/cosmic-gravity/?run=sol-high');await page.waitForURL('**/?run=sol-high#results');assert.equal(await page.locator('[data-pair]:visible').getAttribute('data-pair'),'High');
      await page.goto(url+'/experiments/cosmic-gravity/?run=sol-light#prompt');assert.equal(await page.locator('#prompt-run').inputValue(),'sol-light');
    });
    await check('desktop preview uses full HD and a large original poster',async()=>{await page.goto(url);await page.waitForFunction(()=>document.querySelector('video').videoWidth>0);assert.equal(await page.locator('video').evaluate(v=>v.videoWidth),1920);assert.ok((await page.locator('.feature > img').evaluate(i=>i.currentSrc)).includes('-hero.webp'));});
    await check('only Ultra pair is shown by default',async()=>{await page.goto(url);assert.equal(await page.locator('[data-pair]:visible').count(),1);assert.equal(await page.locator('[data-pair]:visible').getAttribute('data-pair'),'Ultra');assert.equal(await page.locator('.run-card:visible').count(),2);});
    await check('effort selection and deep links select the correct pair',async()=>{await page.getByRole('link',{name:'Extra High',exact:true}).click();assert.equal(await page.locator('[data-pair]:visible').getAttribute('data-pair'),'Extra High');await page.goto(url+'/?run=sol-medium');assert.equal(await page.locator('[data-pair]:visible').getAttribute('data-pair'),'Medium');});
    await check('invalid result identifiers show an honest fallback',async()=>{await page.goto(url+'/?run=not-a-result');assert.ok(await page.locator('#selection-error').isVisible());assert.equal(await page.locator('[data-pair]:visible').getAttribute('data-pair'),'Ultra');});
    for(const run of runs){await check(run.id+' launches in sandbox, switches and unloads',async()=>{
      await page.goto(url+'/?run='+run.id);const trigger=page.locator('.run-card [data-play="'+run.id+'"]');await trigger.click();
      const iframe=page.locator('#frame-slot iframe');await iframe.waitFor();assert.equal(await iframe.getAttribute('sandbox'),'allow-scripts');
      const frame=await iframe.elementHandle().then(h=>h.contentFrame());await frame.waitForSelector('canvas');await page.waitForTimeout(400);
      assert.ok(await frame.evaluate(()=>{try{parent.document;return false;}catch{return true;}}));
      await page.locator('#viewer-restart').click();assert.equal(await page.locator('#frame-slot iframe').count(),1);
      await page.locator('[data-switch="'+(run.model==='Astra'?'Sol':'Astra')+'"]').click();assert.equal(await page.locator('#frame-slot iframe').count(),1);
      await page.locator('#viewer-close').click();await page.waitForFunction(()=>!document.querySelector('iframe'));assert.equal(await page.locator('iframe').count(),0);assert.equal(await trigger.evaluate(el=>document.activeElement===el),true);
    });}
    await check('host controls remain reachable from iframe keyboard focus',async()=>{
      await page.goto(url+'/?run=astra-ultra');await page.locator('.run-card [data-play="astra-ultra"]').click();const frame=await page.locator('iframe').elementHandle().then(h=>h.contentFrame());await frame.waitForLoadState();await frame.locator('button').first().focus();let reached=false;for(let n=0;n<45;n++){await page.keyboard.press('Tab');if(await page.evaluate(()=>['viewer-close','viewer-exit'].includes(document.activeElement.id))){reached=true;break;}}assert.ok(reached);await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('iframe'));assert.equal(await page.locator('iframe').count(),0);
    });
    await check('source is escaped text and download retains original bytes',async()=>{
      await page.locator('[data-source="astra-ultra"]').click();await page.waitForFunction(()=>document.getElementById('source-content').textContent.startsWith('<!DOCTYPE'));assert.equal(await page.locator('#source-dialog canvas').count(),0);await page.locator('#source-close').click();
      const downloadEvent=page.waitForEvent('download');await page.locator('#astra-ultra a[download]').click();const download=await downloadEvent;const stream=await download.createReadStream();const buffers=[];for await(const chunk of stream)buffers.push(chunk);assert.equal(hash(Buffer.concat(buffers)),runs.find(r=>r.id==='astra-ultra').sha256);
    });
    await check('prompt anchor opens the full prompt and historical/new variants copy correctly',async()=>{
      await page.goto(url+'/experiments/cosmic-gravity/#prompt');assert.ok(await page.locator('#prompt-details').getAttribute('open')!==null);await page.locator('#prompt-run').selectOption('sol-light');assert.ok(!(await page.locator('#prompt-text').textContent()).includes('You are Sol-Light'));await page.locator('#prompt-mode').selectOption('new');assert.ok((await page.locator('#prompt-text').textContent()).includes('You are Sol-Light'));await page.locator('#copy-prompt').click();assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n'),await page.locator('#prompt-text').textContent());
    });
    for(const width of [320,390,768,1024,1440]){await check('responsive layout at '+width+' px',async()=>{
      await page.setViewportSize({width,height:900});for(const route of ['','/experiments/cosmic-gravity/']){await page.goto(url+route);await page.evaluate(()=>document.fonts.ready);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route);if(width===390||width===1440){const filename=(route?'experiment':'home')+'-'+width+'.png';await page.screenshot({path:path.join(root,'.local/browser',filename),fullPage:true});report.screenshots.push(filename);}}
    });}
    await check('200 percent zoom reflows without horizontal overflow',async()=>{await page.setViewportSize({width:1440,height:900});for(const route of ['','/experiments/cosmic-gravity/']){await page.goto(url+route);await page.evaluate(()=>document.documentElement.style.zoom='2');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}});
    await check('reduced motion prevents automatic preview requests',async()=>{const c=await browser.newContext({reducedMotion:'reduce'});try{const p=await c.newPage();const videos=[];p.on('request',r=>{if(r.url().endsWith('.mp4'))videos.push(r.url());});await p.goto(url);await p.waitForTimeout(600);assert.equal(videos.length,0);assert.equal(await p.locator('iframe').count(),0);}finally{await c.close();}});
    await check('data saving prevents automatic preview requests',async()=>{const c=await browser.newContext();try{await c.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}));const p=await c.newPage();const videos=[];p.on('request',r=>{if(r.url().endsWith('.mp4'))videos.push(r.url());});await p.goto(url);await p.waitForTimeout(600);assert.equal(videos.length,0);}finally{await c.close();}});
    await check('touch users can select, launch and close a result',async()=>{const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});try{const p=await c.newPage();await p.goto(url);await p.locator('[data-effort="High"]').tap();await p.locator('[data-play="sol-high"]').tap();await p.frameLocator('iframe').locator('canvas').first().waitFor({state:'visible'});await p.locator('#viewer-close').tap();await p.waitForFunction(()=>!document.querySelector('iframe'));assert.equal(await p.locator('iframe').count(),0);}finally{await c.close();}});
    await check('preview pauses offscreen and while a live demo is open',async()=>{await page.setViewportSize({width:1440,height:900});await page.goto(url);await page.locator('#ambient-preview').waitFor();await page.waitForFunction(()=>document.querySelector('video').currentTime>0);await page.locator('#results').evaluate(el=>el.scrollIntoView({block:'start'}));await page.waitForTimeout(250);assert.ok(await page.locator('video').evaluate(v=>v.paused));await page.locator('.feature [data-play]').scrollIntoViewIfNeeded();await page.locator('.feature [data-play]').click();assert.ok(await page.locator('video').evaluate(v=>v.paused));await page.locator('#viewer-close').click();});
    await check('simulated hidden-document visibility pauses and restores the preview',async()=>{await page.goto(url);await page.waitForFunction(()=>document.querySelector('video').currentTime>0);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});assert.ok(await page.locator('video').evaluate(v=>v.paused));await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(()=>!document.querySelector('video').paused);});
    await check('no-JavaScript visitors can reach all original files and the prompt',async()=>{const c=await browser.newContext({javaScriptEnabled:false});try{const p=await c.newPage();await p.goto(url);for(const run of runs)assert.ok(await p.locator('#'+run.id+' .poster-link').isVisible());await p.goto(url+'/experiments/cosmic-gravity/#prompt');assert.ok(await p.locator('#prompt-text').isVisible());assert.equal(await p.locator('iframe').count(),0);}finally{await c.close();}});
    for(const run of runs){await check(run.id+' opens directly and renders',async()=>{const c=await browser.newContext({viewport:{width:1280,height:720}});try{const p=await c.newPage();const failures=[];p.on('pageerror',e=>failures.push(e.message));await p.goto(require('node:url').pathToFileURL(path.join(root,run.path)).href);await p.locator('canvas').first().waitFor({state:'visible'});await p.waitForTimeout(500);assert.deepEqual(failures,[]);}finally{await c.close();}});}
    await check('site reports no runtime errors',async()=>assert.deepEqual(errors,[]));
    report.complete=true;
  }finally{report.finished=new Date().toISOString();write('.local/browser/report.json',JSON.stringify(report,null,2)+'\n');await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});
