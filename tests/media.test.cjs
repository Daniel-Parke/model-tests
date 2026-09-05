const test=require('node:test');const assert=require('node:assert/strict');const {execFileSync}=require('node:child_process');const sharp=require('sharp');
const {fs,path,root,hash}=require('../tools/common.cjs');const {geometry,probe}=require('../tools/media-compose.cjs');
test('montage cells contain all sources without overlap',()=>{for(const count of [1,2,6,10,12]){const cells=geometry(count);assert.equal(cells.length,count);for(const cell of cells){assert.ok(cell.x>=0&&cell.y>=0&&cell.x+cell.w<=1080&&cell.y+cell.h<=1440);assert.ok(cell.w>0&&cell.h>0);}for(let a=0;a<cells.length;a++)for(let b=a+1;b<cells.length;b++){const x=cells[a],y=cells[b];assert.ok(x.x+x.w<=y.x||y.x+y.w<=x.x||x.y+x.h<=y.y||y.y+y.h<=x.y);}}});
test('image and video inputs create identified, hash-verified captures',async()=>{
  fs.mkdirSync(path.join(root,'.local'),{recursive:true});const directory=fs.mkdtempSync(path.join(root,'.local/media-fixture-')),relative=path.relative(root,directory).split(path.sep).join('/');
  const image=await sharp({create:{width:640,height:360,channels:3,background:'#123456'}}).png().toBuffer();fs.writeFileSync(path.join(directory,'image.png'),image);
  const video='assets/previews/astra-ultra-preview.mp4';const config={title:'Import fixture',subtitle:'Fixture',brand:'PatterTech',url:'https://example.invalid/',output:relative+'/output',viewport:{width:640,height:360},warmupMs:0,duration:1,featured:'image',montage:['image','video'],sources:[{id:'image',label:'Image fixture',path:relative+'/image.png',type:'image',sha256:hash(image)},{id:'video',label:'Video fixture',path:video,type:'video',sha256:hash(fs.readFileSync(path.join(root,video)))}]};
  fs.writeFileSync(path.join(directory,'config.json'),JSON.stringify(config));
  execFileSync(process.execPath,['tools/media.cjs','capture'],{cwd:root,env:{...process.env,MEDIA_CONFIG:relative+'/config.json'},timeout:60000});
  const captures=JSON.parse(fs.readFileSync(path.join(directory,'output/captures.json'),'utf8')).captures;assert.equal(captures.length,2);
  for(const capture of captures){assert.equal(capture.imported,true);const file=path.join(directory,'output/raw',capture.id+'.webm');assert.equal(hash(fs.readFileSync(file)),capture.sha256);assert.ok(Math.abs(Number(probe(file).format.duration)-1)<.05);}
  assert.equal(hash(fs.readFileSync(path.join(root,video))),config.sources[1].sha256);
});
