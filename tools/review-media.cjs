const {fs,path,root,json,write,escape:e,hash}=require('./common.cjs');
const {ffmpeg}=require('./media-compose.cjs');const sharp=require('sharp');
async function main(){
  const config=json(process.env.MEDIA_CONFIG||'media.config.json'),folder=path.join(root,config.output,'exports'),review=path.join(root,'.local/media-review');fs.mkdirSync(review,{recursive:true});
  const manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
  const videos=manifest.files.filter(f=>f.name.endsWith('.mp4'));
  const report=[];
  for(const video of videos){
    const stem=path.basename(video.name,'.mp4'),source=path.join(folder,video.name);
    await ffmpeg(['-i',source,'-f','null','-']); // Decode every frame, including the end of each file.
    const snapshots=[];
    for(const second of [0,5,10,15,20,25,29]){
      const frame=path.join(review,stem+'-'+second+'.png');await ffmpeg(['-ss',String(second),'-i',source,'-frames:v','1','-vf','scale=640:-2',frame]);snapshots.push(frame);
    }
    const rows=[];for(const frame of snapshots){const buffer=await sharp(frame).resize(640,360,{fit:'contain',background:'#05080d'}).toBuffer();rows.push(buffer);}
    const sheet=sharp({create:{width:1280,height:1440,channels:3,background:'#18232b'}}).composite(rows.map((input,i)=>({input,left:(i%2)*640,top:Math.floor(i/2)*360})));
    await sheet.png().toFile(path.join(review,stem+'-sequence.png'));
    report.push({file:video.name,sha256:hash(fs.readFileSync(source)),decodedAllFrames:true,sampledSeconds:[0,5,10,15,20,25,29],distinctSnapshots:new Set(snapshots.map(file=>hash(fs.readFileSync(file)))).size});console.log('Decoded and sampled '+video.name);
  }
  write('.local/media-review/report.json',JSON.stringify(report,null,2)+'\n');
  for(const file of ['publication.md','linkedin-companion.md'])fs.copyFileSync(path.join(root,'docs',file),path.join(folder,file));
  const options=videos.map(v=>`<option value="${v.name}" ${v.name==='ten-result-montage.mp4'?'selected':''}>${e(v.name.replace('.mp4','').replaceAll('-',' '))}</option>`).join('');
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PatterTech publication pack</title><style>:root{color-scheme:dark;font-family:system-ui;background:#05080d;color:#eaf2f8}body{max-width:1200px;margin:auto;padding:24px}h1{font-size:clamp(28px,4vw,44px)}p{color:#afc4d2;line-height:1.7}a{color:#33ddff}select,button{font:inherit;padding:12px;background:#101a26;color:white;border:1px solid #385261;border-radius:5px;max-width:100%}video{display:block;background:black;max-width:100%;width:100%;height:70vh;margin:20px 0}nav{display:flex;gap:22px;flex-wrap:wrap;margin:24px 0}img{max-width:100%;height:auto}.images{display:grid;grid-template-columns:1fr 1fr;gap:24px}li{margin:14px 0}:focus-visible{outline:2px solid #33ddff;outline-offset:4px}</style></head><body><p>PatterTech / Model Tests / Local review</p><h1>Cosmic Gravity publication pack</h1><p>Ten default scenes and a separate Astra Ultra interaction clip. Original outputs are unchanged. Nothing in this pack has been uploaded or published.</p><label for="clip">Recording </label><select id="clip">${options}</select><video id="player" controls playsinline preload="metadata" src="ten-result-montage.mp4"></video><nav><a href="linkedin-cosmic-gravity.pdf">Eight-page LinkedIn PDF</a><a href="comparison-x.png">X comparison image</a><a href="publication.md">Copy and upload instructions</a><a href="linkedin-companion.md">PDF text companion</a><a href="manifest.json">Technical manifest</a></nav><div class="images"><div><h2>GitHub preview</h2><a href="github-preview.png"><img src="github-preview.png" alt="PatterTech Model Tests social preview"></a></div><div><h2>Pages social image</h2><a href="pattertech-model-tests-card.png"><img src="pattertech-model-tests-card.png" alt="Cosmic Gravity Pages social image"></a></div></div><h2>Individual downloads</h2><ul>${videos.map(v=>`<li><a href="${v.name}" download>${e(v.name)}</a> · ${(v.bytes/1e6).toFixed(1)} MB</li>`).join('')}</ul><script>document.getElementById('clip').addEventListener('change',e=>{const p=document.getElementById('player');p.pause();p.src=e.target.value;p.load()});</script></body></html>`;
  fs.writeFileSync(path.join(folder,'index.html'),html);
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});
