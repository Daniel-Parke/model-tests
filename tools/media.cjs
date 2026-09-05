const {fs,path,root,hash,json,write,validate,safePath} = require('./common.cjs');
const {serve} = require('./serve.cjs');
const {chromium} = require('playwright');
const sharp = require('sharp');
const configFile = process.env.MEDIA_CONFIG || 'media.config.json';
function inspect() {
  const config = json(configFile);
  if (!config.sources?.length) throw Error('No media sources configured');
  const ids = new Set();
  for (const source of config.sources) {
    if (!/^[a-z0-9-]+$/.test(source.id) || ids.has(source.id)) throw Error('Duplicate or unsafe source identifier');
    ids.add(source.id);
    if (!['html','image','video'].includes(source.type)) throw Error('Unsupported source type');
    if (hash(fs.readFileSync(safePath(root,source.path))) !== source.sha256) throw Error('Source hash mismatch: '+source.id);
  }
  if (!config.montage.length || new Set(config.montage).size !== config.montage.length || config.montage.some(id => !ids.has(id)) || !ids.has(config.featured)) throw Error('Montage and featured identifiers must refer to distinct configured sources');
  safePath(root,config.output);
  return config;
}
async function capture(config) {
  const output = config.output;
  const {server,url} = await serve();
  const browser = await chromium.launch({channel:config.browserChannel || 'chromium'});
  const recordsFile = path.join(output,'captures.json');
  let manifest = fs.existsSync(path.join(root,recordsFile)) ? json(recordsFile) : {version:1,captures:[]};
  const selection = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only')+1] : null;
  const featured=config.sources.find(s=>s.id===config.featured);
  const sources = [...config.sources, ...(config.actions?.length&&featured.type==='html'?[{...featured,id:config.featured+'-interaction',actions:config.actions}]:[])];
  if(selection&&!sources.some(source=>source.id===selection)){await browser.close();server.close();throw Error('Unknown capture identifier: '+selection);}
  try {
    for (const source of sources.filter(s => !selection || s.id===selection)) {
      if (source.type !== 'html') {
        const {ffmpeg,probe}=require('./media-compose.cjs');
        fs.mkdirSync(path.join(root,output,'raw'),{recursive:true});
        const videoPath=path.join(root,output,'raw',source.id+'.webm');
        const posterPath=path.join(root,output,'raw',source.id+'.png');
        if(source.type==='image'){
          await sharp(path.join(root,source.path)).resize(config.viewport.width,config.viewport.height,{fit:'contain',background:'#03060d'}).png().toFile(posterPath);
          await ffmpeg(['-loop','1','-i',posterPath,'-t',String(config.duration),'-r','25','-an','-c:v','libvpx','-deadline','realtime','-b:v','4M',videoPath]);
        }else{
          const input=path.join(root,source.path);
          if(Number(probe(input).format.duration)<config.duration)throw Error('Imported video is shorter than the configured duration: '+source.id);
          await ffmpeg(['-i',input,'-frames:v','1',posterPath]);
          await ffmpeg(['-i',input,'-t',String(config.duration),'-r','25','-an','-c:v','libvpx','-deadline','realtime','-b:v','4M',videoPath]);
        }
        manifest.captures = manifest.captures.filter(c => c.id!==source.id);
        manifest.captures.push({id:source.id,sourceHash:source.sha256,imported:true,type:source.type,configHash:hash(fs.readFileSync(path.join(root,configFile))),sha256:hash(fs.readFileSync(videoPath))});
        write(recordsFile,JSON.stringify(manifest,null,2)+'\n');continue;
      }
      const context = await browser.newContext({viewport:config.viewport,deviceScaleFactor:1,reducedMotion:'no-preference'});
      const page = await context.newPage();
      const errors = [];page.on('pageerror',e=>errors.push(e.message));
      const external = [];page.on('request',r=>{if (!r.url().startsWith(url) && !r.url().startsWith('data:')) external.push(r.url());});
      const started = new Date().toISOString();
      try {
        await page.goto(url+'/'+source.path.split('/').map(encodeURIComponent).join('/'));
        await page.locator(source.ready || 'canvas').first().waitFor({state:'visible'});
        await page.waitForTimeout(config.warmupMs);
        fs.mkdirSync(path.join(root,output,'raw'),{recursive:true});
        const poster = await page.screenshot();
        write(`${output}/raw/${source.id}.png`,poster);
        if (!source.actions) {
          const directory=path.join(root,require('./media-compose.cjs').websiteAssets(config),'previews');fs.mkdirSync(directory,{recursive:true});
          await sharp(poster).resize(960,540,{fit:'inside'}).webp({quality:80}).toFile(path.join(directory,source.id+'.webp'));
        }
        const videoPath = path.join(root,output,'raw',source.id+'.webm');
        await page.screencast.start({path:videoPath,size:config.viewport});
        const start = performance.now();
        for (const action of source.actions || []) {
          await page.waitForTimeout(Math.max(0,action.at*1000-(performance.now()-start)));
          const x=action.x*config.viewport.width,y=action.y*config.viewport.height;
          if (action.kind==='move') await page.mouse.move(x,y,{steps:30});
          if (action.kind==='click') await page.mouse.click(x,y);
          if (action.kind==='black-hole') {await page.keyboard.down('Shift');await page.mouse.click(x,y);await page.keyboard.up('Shift');}
          if (action.kind==='drag') {
            await page.mouse.move(x,y);await page.mouse.down();
            for(let step=1;step<=30;step++){await page.mouse.move(x+(action.toX*config.viewport.width-x)*step/30,y+(action.toY*config.viewport.height-y)*step/30);await page.waitForTimeout((action.durationMs||1000)/30);}
            await page.mouse.up();
          }
        }
        await page.waitForTimeout(Math.max(0,config.duration*1000-(performance.now()-start)));
        await page.screencast.stop();
        if (hash(fs.readFileSync(path.join(root,source.path)))!==source.sha256) throw Error('Source changed during capture');
        if (errors.length || external.length) throw Error(JSON.stringify({errors,external}));
        manifest.captures=manifest.captures.filter(c=>c.id!==source.id);
        manifest.captures.push({id:source.id,source:source.path,sourceHash:source.sha256,configHash:hash(fs.readFileSync(path.join(root,configFile))),browser:browser.version(),browserChannel:config.browserChannel || 'chromium',playwright:require('playwright/package.json').version,viewport:config.viewport,deviceScaleFactor:1,warmupMs:config.warmupMs,duration:config.duration,fps:25,started,finished:new Date().toISOString(),actions:source.actions || [],errors,external,sha256:hash(fs.readFileSync(videoPath))});
        write(recordsFile,JSON.stringify(manifest,null,2)+'\n');
        console.log('Captured '+source.id);
      } finally {await context.close();}
    }
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
async function main() {
  const config=inspect();fs.mkdirSync(path.join(root,'assets/previews'),{recursive:true});
  const command=process.argv[2] || 'inspect';
  if(command==='inspect') console.log(JSON.stringify({project:config.title,sources:config.sources.length,output:config.output,configHash:hash(fs.readFileSync(path.join(root,configFile)))},null,2));
  else if(command==='capture') await capture(config);
  else if(command==='compose') await require('./media-compose.cjs').compose(config);
  else if(command==='verify') await require('./media-compose.cjs').verify(config);
  else throw Error('Use inspect, capture, compose or verify');
}
if(require.main===module) main().catch(error=>{console.error(error.stack);process.exitCode=1;});
module.exports={inspect,capture};
