const {fs,path,root,hash,write,json,escape:e} = require('./common.cjs');
const {chromium} = require('playwright');
const sharp = require('sharp');
const {execFile,execFileSync} = require('node:child_process');
const {promisify} = require('node:util');
const execute = promisify(execFile);
function binary(name) {
  if(process.env[name.toUpperCase()])return process.env[name.toUpperCase()];
  const folder=path.join(root,'.tool-cache/ffmpeg');
  if(fs.existsSync(folder))for(const child of fs.readdirSync(folder)){const candidate=path.join(folder,child,'bin',name+'.exe');if(fs.existsSync(candidate))return candidate;}
  return execFileSync(process.platform==='win32'?'where.exe':'which',[name],{encoding:'utf8'}).trim().split(/\r?\n/)[0];
}
function probe(file){return JSON.parse(execFileSync(binary('ffprobe'),['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8',maxBuffer:4e6}));}
async function ffmpeg(args){await execute(binary('ffmpeg'),['-hide_banner','-loglevel','error','-y',...args],{maxBuffer:8e6,timeout:900000});}
const dataFile=(file,mime='image/png')=>'data:'+mime+';base64,'+fs.readFileSync(file).toString('base64');
const posterData=(config,id)=>config.imageData?.[id] || dataFile(path.join(root,config.output,'raw',id+'.png'));
const websiteAssets=config=>config.websiteAssets || (process.env.MEDIA_CONFIG&&process.env.MEDIA_CONFIG!=='media.config.json'?config.output+'/website':'assets');
const fontCss=()=>`@font-face{font-family:Space;src:url(${dataFile(path.join(root,'assets/fonts/spacegrotesk.woff2'),'font/woff2')}) format('woff2');font-weight:400 700}@font-face{font-family:Inter;src:url(${dataFile(path.join(root,'assets/fonts/inter.woff2'),'font/woff2')}) format('woff2');font-weight:400 700}`;
function style(){return `${fontCss()}*{box-sizing:border-box}html,body{margin:0;background:#05080d;color:#eaf2f8;font-family:Inter,sans-serif}h1,h2,h3{font-family:Space,sans-serif;font-weight:500;letter-spacing:-.04em;margin:0}p{line-height:1.55;color:#c9d6e0}a{color:#33ddff;text-decoration:none}.brand{font-family:Space,sans-serif;letter-spacing:-.04em;font-size:28px;display:flex;align-items:center;gap:10px}.brand img{width:38px;height:38px}.brand b{color:#33ddff;font-weight:500}.kicker{color:#33ddff;text-transform:uppercase;letter-spacing:.12em;font-size:17px}.muted{color:#96a9ba}.rule{height:1px;background:#243441}.canvas{position:relative;overflow:hidden;background:radial-gradient(ellipse at 80% 0,#102a38 0,transparent 50%),#05080d}.label{font-family:Space,sans-serif;font-size:22px;position:absolute}.frame{position:absolute;object-fit:contain;background:#03060d}.foot{position:absolute;bottom:14px;left:40px;right:40px;display:flex;justify-content:space-between;color:#96a9ba;font-size:14px}`;}
function brand(config){return `<div class="brand"><img src="${dataFile(path.join(root,'assets/pattertech-mark.svg'),'image/svg+xml')}" alt=""><span><b>${e(config.brand.slice(0,6))}</b>${e(config.brand.slice(6))}</span></div>`;}
const shell=body=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${style()}</style></head><body>${body}</body></html>`;
function geometry(count=10){
  if(count===10)return Array.from({length:10},(_,i)=>i<9?{x:40+(i%3)*340,y:154+Math.floor(i/3)*218,w:320,h:180}:{x:40,y:838,w:1000,h:562});
  const cols=Math.min(3,count),rows=Math.ceil(count/cols),w=Math.floor(Math.min((1000-(cols-1)*20)/cols,(1200/rows-44)*16/9)/2)*2,h=Math.floor(w*9/16/2)*2;
  return Array.from({length:count},(_,i)=>({x:40+(i%cols)*(1000/cols)+(1000/cols-w)/2,y:154+Math.floor(i/cols)*(h+44),w,h}));
}
function montageHtml(config,images=true){
  const cells=geometry(config.montage.length);
  return shell(`<main class="canvas" style="width:1080px;height:1440px"><div style="position:absolute;top:26px;left:40px">${brand(config)}</div><h1 style="position:absolute;top:72px;left:40px;font-size:38px">${e(config.subtitle)} <span class="muted">/ ${config.sources.length} outputs</span></h1><div style="position:absolute;top:90px;right:40px;font-size:15px;color:#96a9ba">${e(config.title)}</div>${config.montage.map((id,i)=>{const source=config.sources.find(s=>s.id===id),g=cells[i];return `<div class="label" style="left:${g.x}px;top:${g.y-34}px;${i===9?'color:#33ddff;font-size:25px':''}">${e(source.label)}${i===9?' <span class="muted" style="font-size:18px">/ Featured</span>':''}</div>${images?`<img class="frame" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px" src="${dataFile(path.join(root,config.output,'raw',id+'.png'))}" alt="${e(source.label)}">`:''}`;}).join('')}<div class="foot"><span>Original default scenes. No quality ranking.</span><span>${e(config.url.replace('https://',''))}</span></div></main>`);
}
async function screenshot(browser,html,file,width,height,scale=1){const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:scale});try{const page=await context.newPage();await page.setContent(html);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:file});}finally{await context.close();}}
function individualHtml(config,label){return shell(`<main class="canvas" style="width:1920px;height:1080px"><div style="position:absolute;left:64px;top:40px">${brand(config)}</div><div style="position:absolute;left:590px;top:35px"><h1 style="font-size:38px">${e(label)}</h1><p style="margin:4px 0;font-size:18px">${e(config.subtitle)} · Original output</p></div><div style="position:absolute;right:64px;top:54px;font-size:18px;color:#96a9ba">${e(config.url.replace('https://',''))}</div><div class="foot" style="left:160px;bottom:10px"><span>Recorded at native 25 fps. This is not a frame-rate benchmark.</span><span>${e(config.title)}</span></div></main>`);}
function socialHtml(config,width,height){
  return shell(`<main class="canvas" style="width:${width}px;height:${height}px"><img src="${dataFile(path.join(root,config.output,'raw',config.featured+'.png'))}" style="position:absolute;width:66%;height:100%;right:0;object-fit:contain" alt=""><div style="position:absolute;inset:0;background:linear-gradient(90deg,#05080d 33%,#05080df2 43%,#05080d33 66%,transparent)"></div><div style="position:absolute;left:55px;top:45px">${brand(config)}</div><div style="position:absolute;left:55px;top:155px;width:610px"><div class="kicker">One brief. Ten outputs.</div><h1 style="font-size:78px;line-height:1.04;margin-top:18px">Model Tests</h1><h2 style="font-size:38px;margin-top:22px">${e(config.subtitle)}</h2><p style="font-size:22px;max-width:470px">Astra and Sol. Five effort levels.<br>Open the demos. Compare the decisions.</p></div><div style="position:absolute;bottom:42px;left:55px;right:55px;border-top:1px solid #35515d;padding-top:20px;display:flex;justify-content:space-between;font-size:17px"><span>${e(config.url.replace('https://',''))}</span><span class="muted">Original Astra Ultra scene</span></div></main>`);
}
function deckHtml(config){
  const page=(body,n)=>`<section class="page"><header>${brand(config)}<span>${e(config.subtitle)}</span></header>${body}<footer><a href="${config.url}">${e(config.url.replace('https://',''))}</a><span>${n} / 8</span></footer></section>`;
  let pages=page(`<div class="kicker" style="margin-top:64px">Model Tests / Experiment 01</div><h1 style="font-size:76px;line-height:1.04;margin-top:24px">Same brief.<br>Different universes.</h1><p class="lead">Ten original simulations from Astra and Sol,<br>across five effort levels.</p><img class="hero-image" src="${posterData(config,config.featured)}" alt="Astra Ultra"><p class="caption">Featured: Astra Ultra. An editorial choice, not a measured winner.</p>`,1);
  pages+=page(`<div class="kicker" style="margin-top:70px">The task</div><h1>Build a small universe.<br>Put it in one HTML file.</h1><p class="lead">The prompt asks for glowing particles, gravity, subtle expansion and satisfying interaction. No external libraries or assets.</p><div class="notes"><h2>What to compare</h2><p>Look at the initial scene, movement, controls and the choices each model makes. Open the actual simulations to test the interactions.</p><h2>What this does not establish</h2><p>This is not a controlled benchmark or a general ranking. Historical working context and tool use were not fully recorded.</p><h2>A small prompt difference</h2><p>The first four runs used the original brief. Later runs added the same short naming paragraph, changing only the model and effort label.</p></div>`,2);
  ['Light','Medium','High','Extra High','Ultra'].forEach((effort,index)=>{
    const sources=config.sources.filter(s=>s.label.endsWith('/ '+effort));
    pages+=page(`<div class="kicker" style="margin-top:24px">Effort comparison ${index+1} / 5</div><h1 style="font-size:48px;margin:8px 0 12px">${effort}</h1>${sources.map(s=>`<div class="compare-label"><h2>${e(s.label.split(' / ')[0])}</h2><a href="${config.url+s.path.split('/').map(encodeURIComponent).join('/')}">Open original ↗</a></div><img class="compare-image" src="${posterData(config,s.id)}" alt="${e(s.label)}">`).join('')}<p class="caption">Real default scenes. Each launch varies. The full interface is preserved.</p>`,index+3);
  });
  pages+=page(`<div class="kicker" style="margin-top:80px">Try it yourself</div><h1>Open a demo.<br>Make up your own mind.</h1><p class="lead">Launch stars, change the gravity and see what holds together. Then switch models and try again.</p><div class="notes"><h2><a href="${config.url}#results">Explore all ten simulations →</a></h2><p>The site includes original HTML downloads, source views and the prompt used for each result.</p><h2><a href="${config.url}experiments/cosmic-gravity/#prompt">Reuse the prompt →</a></h2><p>Future runs use an isolated workspace. The delivered output is frozen before presentation work begins.</p><h2><a href="https://github.com/Daniel-Parke/model-tests">Read the code and methodology →</a></h2><p>Code and demos use the MIT licence. PatterTech branding and third-party assets have separate terms.</p></div>`,8);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Model Tests: Cosmic Gravity</title><style>${style()}@page{size:810px 1080px;margin:0}.page{width:810px;height:1080px;padding:42px 44px;position:relative;overflow:hidden;break-after:page;background:#05080d}.page:last-child{break-after:auto}header,footer{display:flex;justify-content:space-between;align-items:center;color:#96a9ba;font-size:14px}header{padding-bottom:24px;border-bottom:1px solid #243441}footer{position:absolute;bottom:28px;left:44px;right:44px;border-top:1px solid #243441;padding-top:18px}.page h1{font-size:62px;line-height:1.1;margin:22px 0}.lead{font-size:24px;line-height:1.5}.notes{margin-top:38px}.notes h2{font-size:28px;margin:30px 0 10px}.notes p{font-size:20px;margin:0}.hero-image{width:722px;aspect-ratio:16/9;object-fit:contain;margin-top:35px}.caption{font-size:14px;color:#96a9ba}.compare-label{display:flex;justify-content:space-between;align-items:center;margin:14px 0 8px}.compare-label h2{font-size:27px}.compare-label a{font-size:15px}.compare-image{width:540px;height:303.75px;object-fit:contain;display:block;margin:auto;border:1px solid #243441}</style></head><body>${pages}</body></html>`;
}
async function composePreview(config){
  const directory=path.join(root,websiteAssets(config),'previews');fs.mkdirSync(directory,{recursive:true});
  const source=path.join(root,config.output,'raw',config.featured+'.webm');
  for(const [suffix,width] of [['',1920],['-mobile',960]])await ffmpeg(['-i',source,'-t','6','-vf',`scale=${width}:-2`,'-an','-c:v','libx264','-preset','slow','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(directory,config.featured+'-preview'+suffix+'.mp4')]);
  await sharp(path.join(root,config.output,'raw',config.featured+'.png')).resize(1920,1080).webp({quality:88}).toFile(path.join(directory,config.featured+'-hero.webp'));
}
async function compose(config){
  const onlyIndex=process.argv.indexOf('--only'),only=onlyIndex<0?null:process.argv[onlyIndex+1];
  if(only&&!config.sources.some(s=>s.id===only)&&only!==config.featured+'-interaction')throw Error('Unknown composition identifier');
  const out=path.join(root,config.output),exports=path.join(out,'exports'),frames=path.join(out,'frames');fs.mkdirSync(exports,{recursive:true});fs.mkdirSync(frames,{recursive:true});
  const siteAssets=path.join(root,websiteAssets(config));fs.mkdirSync(path.join(siteAssets,'previews'),{recursive:true});
  if(config.subtitle!=='Cosmic Gravity'&&!config.deckHtml)throw Error('Supply deckHtml for a project-specific print document. The built-in deck is for Cosmic Gravity.');
  const captures=json(config.output+'/captures.json');
  for(const source of config.sources){const record=captures.captures.find(c=>c.id===source.id);if(!record||record.sourceHash!==source.sha256||record.configHash!==hash(fs.readFileSync(path.join(root,process.env.MEDIA_CONFIG||'media.config.json'))))throw Error('Missing or stale capture: '+source.id);}
  if(process.argv.includes('--preview-only')){await composePreview(config);await verify(config);return;}
  const browser=await chromium.launch({channel:'chromium'});
  try{
    if(!only){
    write(config.output+'/exports/comparison-layout.html',montageHtml(config));
    await screenshot(browser,montageHtml(config,false),path.join(frames,'montage.png'),1080,1440);
    await screenshot(browser,montageHtml(config),path.join(exports,'comparison-x.png'),1080,1440,4/3);
    for(const [name,w,h] of [['github-preview',1280,640],['pattertech-model-tests-card',1200,630]]){
      const html=socialHtml(config,w,h);write(config.output+'/exports/'+name+'.html',html);
      await screenshot(browser,html,path.join(exports,name+'.png'),w,h);
      await sharp(path.join(exports,name+'.png')).png({palette:true,quality:95}).toFile(path.join(siteAssets,name+'.png'));
    }
    const imageData={};for(const source of config.sources){const data=await sharp(path.join(out,'raw',source.id+'.png')).resize(1440,810,{fit:'inside'}).jpeg({quality:88,mozjpeg:true}).toBuffer();imageData[source.id]='data:image/jpeg;base64,'+data.toString('base64');}
    const deck=config.deckHtml?fs.readFileSync(path.join(root,config.deckHtml),'utf8'):deckHtml({...config,imageData});write(config.output+'/exports/linkedin-deck.html',deck);
    const page=await browser.newPage();await page.setContent(deck);await page.evaluate(()=>document.fonts.ready);await page.pdf({path:path.join(exports,'linkedin-cosmic-gravity.pdf'),printBackground:true,preferCSSPageSize:true,tagged:true});await page.close();
    console.log('Images and eight-page PDF composed.');
    if(process.argv.includes('--stills-only'))return;
    }
    for(const source of [...config.sources,...(config.actions?.length?[{...config.sources.find(s=>s.id===config.featured),id:config.featured+'-interaction',label:config.sources.find(s=>s.id===config.featured).label+' / Interaction'}]:[])]){
      if(only&&source.id!==only)continue;
      const frame=path.join(frames,source.id+'.png');await screenshot(browser,individualHtml(config,source.label),frame,1920,1080);
      const inputs=['-loop','1','-i',frame,'-i',path.join(out,'raw',source.id+'.webm')];
      let filter=`[1:v]trim=duration=${config.duration},setpts=PTS-STARTPTS,scale=1600:900:force_original_aspect_ratio=decrease,pad=1600:900:(ow-iw)/2:(oh-ih)/2:color=black[v];[0:v][v]overlay=160:140:shortest=1[base]`,mapped='base';
      if(source.id.endsWith('-interaction')){
        const captions=[{at:0,text:'Default scene'},...config.actions.filter((a,i)=>i===0||a.kind!==config.actions[i-1].kind).map(a=>({at:a.at,text:a.label||({move:'Move the pointer to stir',click:'Click to create a star',drag:'Drag to launch an object','black-hole':'Shift-click to add a black hole'}[a.kind])}))];
        for(let i=0;i<captions.length;i++){
          const file=path.join(frames,'action-'+i+'.png');await screenshot(browser,shell(`<div style="width:600px;height:36px;color:#33ddff;font-size:22px;line-height:36px">${e(captions[i].text)}</div>`),file,600,36);
          inputs.push('-loop','1','-i',file);const next='caption'+i;filter+=`;[${mapped}][${i+2}:v]overlay=1260:92:enable='gte(t,${captions[i].at})*lt(t,${captions[i+1]?.at||config.duration})'[${next}]`;mapped=next;
        }
      }
      await ffmpeg([...inputs,'-filter_complex',filter,'-map',`[${mapped}]`,'-t',String(config.duration),'-r','25','-an','-c:v','libx264','-preset','fast','-crf','20','-maxrate','12M','-bufsize','24M','-pix_fmt','yuv420p','-movflags','+faststart',path.join(exports,source.id+'.mp4')]);
      console.log('Composed '+source.id);
    }
    if(only){await verify(config);return;}
    const args=['-loop','1','-i',path.join(frames,'montage.png')];config.montage.forEach(id=>args.push('-i',path.join(out,'raw',id+'.webm')));
    const filters=[];geometry(config.montage.length).forEach((g,i)=>{filters.push(`[${i+1}:v]trim=duration=${config.duration},setpts=PTS-STARTPTS,scale=${g.w}:${g.h}:force_original_aspect_ratio=decrease,pad=${g.w}:${g.h}:(ow-iw)/2:(oh-ih)/2:color=black[v${i}]`);filters.push(`[${i===0?'0:v':'o'+(i-1)}][v${i}]overlay=${g.x}:${g.y}:shortest=1[o${i}]`);});
    await ffmpeg([...args,'-filter_complex',filters.join(';'),'-map',`[o${config.montage.length-1}]`,'-t',String(config.duration),'-r','25','-an','-c:v','libx264','-preset','fast','-crf','20','-maxrate','12M','-bufsize','24M','-pix_fmt','yuv420p','-movflags','+faststart',path.join(exports,'ten-result-montage.mp4')]);
    await composePreview(config);
    console.log('Montage and website preview composed.');
  }finally{await browser.close();}
  await verify(config);
}
async function verify(config){
  const captures=json(config.output+'/captures.json');
  const configHash=hash(fs.readFileSync(path.join(root,process.env.MEDIA_CONFIG||'media.config.json')));
  const sourceList=[...config.sources,...(config.actions?.length?[{...config.sources.find(s=>s.id===config.featured),id:config.featured+'-interaction'}]:[])];
  for(const source of sourceList){
    const capture=captures.captures.find(c=>c.id===source.id);
    if(!capture||capture.configHash!==configHash||capture.sourceHash!==source.sha256||capture.sha256!==hash(fs.readFileSync(path.join(root,config.output,'raw',source.id+'.webm'))))throw Error('Capture integrity check failed: '+source.id);
    if(hash(fs.readFileSync(path.join(root,source.path)))!==source.sha256)throw Error('Original source changed: '+source.id);
  }
  const directory=path.join(root,config.output,'exports'),files=[];
  for(const name of fs.readdirSync(directory)){
    if(!/\.(mp4|png|pdf)$/.test(name))continue;
    const file=path.join(directory,name),data=fs.readFileSync(file),item={name,bytes:data.length,sha256:hash(data)};
    if(name.endsWith('.mp4')){const details=probe(file),video=details.streams.find(s=>s.codec_type==='video');Object.assign(item,{width:video.width,height:video.height,fps:video.avg_frame_rate,duration:Number(details.format.duration)});const dimensions=name==='ten-result-montage.mp4'?[1080,1440]:[1920,1080];if(item.width!==dimensions[0]||item.height!==dimensions[1]||video.avg_frame_rate!=='25/1'||Math.abs(item.duration-config.duration)>.041||data.length>50e6)throw Error('Video profile failed: '+name);}
    if(name.endsWith('.png')){const dimensions=await sharp(file).metadata();Object.assign(item,{width:dimensions.width,height:dimensions.height});if(name==='comparison-x.png'&&(item.width!==1440||item.height!==1920||data.length>5e6))throw Error('Comparison image profile failed');}
    if(name.endsWith('.pdf')&&data.length>10e6)throw Error('PDF exceeds 10 MB');files.push(item);
  }
  const expected=[...sourceList.map(s=>s.id+'.mp4'),'ten-result-montage.mp4','comparison-x.png','github-preview.png','pattertech-model-tests-card.png','linkedin-cosmic-gravity.pdf'];
  for(const name of expected)if(!files.some(f=>f.name===name))throw Error('Missing export: '+name);
  for(const [name,width,height] of [['github-preview.png',1280,640],['pattertech-model-tests-card.png',1200,630]]){const item=files.find(f=>f.name===name);if(item.width!==width||item.height!==height||item.bytes>1e6)throw Error('Social image profile failed: '+name);}
  for(const name of ['github-preview.png','pattertech-model-tests-card.png'])if(fs.statSync(path.join(root,websiteAssets(config),name)).size>1e6)throw Error('Social image exceeds 1 MB');
  for(const [suffix,width,limit] of [['',1920,4000000],['-mobile',960,1500000]]){const file=path.join(root,websiteAssets(config),'previews',config.featured+'-preview'+suffix+'.mp4'),details=probe(file),video=details.streams.find(s=>s.codec_type==='video');if(video.width!==width||video.height!==width*9/16||video.avg_frame_rate!=='25/1'||Math.abs(Number(details.format.duration)-6)>.041||fs.statSync(file).size>limit)throw Error('Website preview profile failed: '+suffix);}
  const website=[];for(const name of ['github-preview.png','pattertech-model-tests-card.png',...config.sources.filter(s=>s.type==='html').map(s=>'previews/'+s.id+'.webp'),'previews/'+config.featured+'-preview.mp4','previews/'+config.featured+'-preview-mobile.mp4','previews/'+config.featured+'-hero.webp']){const file=path.join(root,websiteAssets(config),name),data=fs.readFileSync(file);website.push({name,bytes:data.length,sha256:hash(data)});}
  const manifest={version:1,verified:new Date().toISOString(),configHash:hash(fs.readFileSync(path.join(root,process.env.MEDIA_CONFIG||'media.config.json'))),ffmpeg:execFileSync(binary('ffmpeg'),['-version'],{encoding:'utf8'}).split('\n')[0],ffmpegSha256:hash(fs.readFileSync(binary('ffmpeg'))),captureManifestSha256:hash(fs.readFileSync(path.join(root,config.output,'captures.json'))),sources:config.sources.map(s=>({id:s.id,sha256:s.sha256})),files,website,visualReview:'Separate manual review required; technical validation does not establish visual acceptance.'};
  write(config.output+'/exports/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log('Verified '+files.length+' media exports.');return manifest;
}
module.exports={compose,verify,probe,binary,deckHtml,ffmpeg,geometry,websiteAssets};
