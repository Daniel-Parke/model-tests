const {fs,path,root}=require('../tools/common.cjs');
const skipped=new Set(['.git','.local','.local-archive','.media','.tool-cache','node_modules']);
function walk(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>skipped.has(entry.name)?[]:entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);}
const failures=[];let checked=0;
for(const file of walk(root).filter(file=>/\.(html|md)$/.test(file))){
  const content=fs.readFileSync(file,'utf8');
  const links=file.endsWith('.html')?[...content.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...content.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
  for(const link of links){
    if(/^(https?:|data:|mailto:|tel:)/.test(link))continue;
    const [relative,fragment]=link.split('#');const target=relative?path.resolve(path.dirname(file),decodeURIComponent(relative.split('?')[0])):file;
    checked++;
    if(!fs.existsSync(target)){failures.push(path.relative(root,file)+': '+link);continue;}
    let html=target;if(fs.statSync(html).isDirectory())html=path.join(html,'index.html');
    if(!fs.existsSync(html)){failures.push('Missing directory index: '+link);continue;}
    if(fragment&&html.endsWith('.html')&&!fs.readFileSync(html,'utf8').includes(`id="${fragment}"`))failures.push('Missing anchor: '+path.relative(root,file)+' -> '+link);
  }
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('Verified '+checked+' local file and anchor links.');
