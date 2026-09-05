const {chromium}=require('playwright');
const {serve}=require('../tools/serve.cjs');
const {write,read}=require('../tools/common.cjs');
const {gzipSync}=require('node:zlib');
async function main(){
  const {server,url}=await serve();const browser=await chromium.launch({channel:'chromium'});const runs=[];
  try{for(let i=0;i<3;i++){
    const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const page=await context.newPage();const cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await page.addInitScript(()=>{
      window.lab={lcp:0,cls:0};
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.lab.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    });
    await page.goto(url);await page.waitForTimeout(6000);
    runs.push(await page.evaluate(()=>({...window.lab,essentialBytes:performance.getEntriesByType('resource').filter(e=>!e.name.endsWith('.mp4')).reduce((sum,e)=>sum+e.transferSize,0)+performance.getEntriesByType('navigation')[0].transferSize,resources:performance.getEntriesByType('resource').map(e=>({url:new URL(e.name).pathname,bytes:e.transferSize}))})));
    await context.close();
  }}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
  const median=key=>runs.map(r=>r[key]).sort((a,b)=>a-b)[1];const compressedBytes=['assets/site.css','assets/site.js','assets/catalogue.js'].reduce((sum,file)=>sum+gzipSync(read(file)).length,0);
  const report={profile:{viewport:'390 × 844',deviceScaleFactor:1,network:'1.6 Mbit/s download, 150 ms latency',cpu:'4× slowdown',cache:'cold',browser:'Full Chromium',samples:3,scope:'landing page only; includes automatic preview eligibility'},runs,medianLcpMs:median('lcp'),medianCls:median('cls'),medianEssentialBytes:median('essentialBytes'),compressedCssJsBytes:compressedBytes};
  report.passed=report.medianLcpMs<=2500&&report.medianCls<=.1&&report.medianEssentialBytes<=500000&&compressedBytes<=75000;
  write('.local/performance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});
