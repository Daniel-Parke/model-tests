const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {serve}=require('../tools/serve.cjs');
const {write}=require('../tools/common.cjs');
async function main(){
  const {server,url}=await serve();const browser=await chromium.launch({channel:'chromium'});
  const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.stack));
  try{
    await page.goto(url+'/?run=astra-medium');
    for(let cycle=0;cycle<30;cycle++){
      await page.locator('[data-play="astra-medium"]').click();
      await page.frameLocator('iframe').locator('canvas').first().waitFor({state:'visible'});
      await page.locator('#viewer-restart').click();
      await page.locator('[data-switch="Sol"]').click();
      await page.locator('#viewer-close').click();
      await page.waitForFunction(()=>!document.querySelector('#viewer').open&&!document.querySelector('iframe'));
    }
    write('.local/lifecycle-final.json',JSON.stringify({cycles:30,errors},null,2)+'\n');
    assert.deepEqual(errors,[]);console.log('PASS 30 rapid restart, switch and close cycles without runtime errors');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
