const {fs,path,root,json,hash,promptFor,safePath} = require('./common.cjs');
function argument(name){const index=process.argv.indexOf('--'+name);if(index<0||!process.argv[index+1])throw Error('Missing --'+name);return process.argv[index+1];}
function prepare({experimentId,model,effort,out}){
  const experiment=json('catalogue.json').experiments.find(e=>e.id===experimentId);
  if(!experiment)throw Error('Unknown experiment');
  if(!/^[A-Za-z0-9 .-]+$/.test(model)||!/^[A-Za-z0-9 .-]+$/.test(effort))throw Error('Invalid model or effort label');
  const destination=path.resolve(out);
  if(destination===root||destination.startsWith(root+path.sep))throw Error('Generation workspace must be outside the publication repository');
  if(fs.existsSync(destination))throw Error('Choose a new, empty workspace path');
  const prompt=experiment.id==='cosmic-gravity'?promptFor(experiment,{model,effort},false):fs.readFileSync(path.join(root,experiment.prompt),'utf8');
  fs.mkdirSync(destination,{recursive:true});
  fs.writeFileSync(path.join(destination,'prompt.md'),prompt,{flag:'wx'});
  fs.writeFileSync(path.join(destination,'run.json'),JSON.stringify({version:1,experiment:experimentId,requestedModel:model,requestedEffort:effort,promptSha256:hash(Buffer.from(prompt)),prepared:new Date().toISOString(),actualRuntime:'unknown',tools:'unknown',suppliedContext:'prompt.md and run.json only; operator must record actual context',interventions:[],accessBoundary:'unknown'},null,2)+'\n',{flag:'wx'});
  return destination;
}
function freeze({workspace,output}){
  const directory=path.resolve(workspace),metadata=JSON.parse(fs.readFileSync(path.join(directory,'run.json'),'utf8'));
  const prompt=fs.readFileSync(path.join(directory,'prompt.md'));
  if(hash(prompt)!==metadata.promptSha256)throw Error('Prompt changed during the run');
  const source=safePath(directory,output);if(source===path.join(directory,'prompt.md')||source===path.join(directory,'run.json'))throw Error('Select a delivered output');
  const data=fs.readFileSync(source),destination=path.join(directory,'frozen');
  fs.mkdirSync(destination); // Refuse replacement of any earlier frozen bundle.
  fs.writeFileSync(path.join(destination,path.basename(source)),data,{flag:'wx'});
  fs.writeFileSync(path.join(destination,'manifest.json'),JSON.stringify({...metadata,frozen:new Date().toISOString(),artefact:path.basename(source),sha256:hash(data),bytes:data.length},null,2)+'\n',{flag:'wx'});
  return destination;
}
if(require.main===module){try{const command=process.argv[2];if(command==='prepare')console.log(prepare({experimentId:argument('experiment'),model:argument('model'),effort:argument('effort'),out:argument('out')}));else if(command==='freeze')console.log(freeze({workspace:argument('workspace'),output:argument('output')}));else throw Error('Use prepare --experiment <id> --model <label> --effort <label> --out <new directory>, or freeze --workspace <directory> --output <relative file>');}catch(error){console.error(error.message);process.exitCode=1;}}
module.exports={prepare,freeze};
