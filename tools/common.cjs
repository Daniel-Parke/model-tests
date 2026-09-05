const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url = file => file.split('/').map(encodeURIComponent).join('/');
function safePath(base, relative) {
  const target = path.resolve(base, relative);
  if (target !== base && !target.startsWith(base + path.sep)) throw Error('Path outside workspace: ' + relative);
  return target;
}
function write(file, data) {
  const target = safePath(root, file); fs.mkdirSync(path.dirname(target), {recursive:true}); fs.writeFileSync(target, data);
}
function validate(catalogue, base = root) {
  if (catalogue.version !== 1 || !Array.isArray(catalogue.experiments)) throw Error('Unsupported catalogue');
  const ids = new Set();
  for (const experiment of catalogue.experiments) {
    if (!/^[a-z0-9-]+$/.test(experiment.id) || ids.has(experiment.id)) throw Error('Duplicate or invalid experiment identifier');
    ids.add(experiment.id);
    const prompt = fs.readFileSync(safePath(base, experiment.prompt));
    if (hash(prompt) !== experiment.promptSha256) throw Error('Prompt hash mismatch: ' + experiment.id);
    const runIds = new Set();
    for (const run of experiment.runs) {
      if (!/^[a-z0-9-]+$/.test(run.id) || runIds.has(run.id)) throw Error('Duplicate or invalid run identifier');
      runIds.add(run.id);
      if (!['published','local'].includes(run.publication)) throw Error('Invalid publication status');
      if (!run.type || !run.model || !run.effort) throw Error('Incomplete run metadata');
      const data = fs.readFileSync(safePath(base, run.path));
      if (hash(data) !== run.sha256) throw Error('Artefact hash mismatch: ' + run.id);
    }
    if (experiment.featured && !runIds.has(experiment.featured)) throw Error('Missing featured result');
  }
  return catalogue;
}
function promptFor(experiment, run, historical = true) {
  const canonical = read(experiment.prompt).replace(/\r\n/g, '\n');
  const boundary = canonical.lastIndexOf('\nYou are ');
  if (boundary < 0) throw Error('Missing naming paragraph');
  if (historical && run.promptVariant === 'original') return canonical.slice(0, boundary).trimEnd() + '\n';
  return canonical.replace('You are Sol-High and', `You are ${run.model}-${run.effort} and`);
}
module.exports = {fs,path,root,hash,read,json,escape,url,safePath,write,validate,promptFor};
