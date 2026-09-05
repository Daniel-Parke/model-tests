(() => {
  'use strict';
  document.documentElement.classList.replace('no-js','js');
  const prefix=document.body.dataset.prefix || '';
  const experiment=window.MODEL_TESTS.experiments.find(e=>e.id==='cosmic-gravity');
  const runs=experiment.runs;
  const find=id=>runs.find(r=>r.id===id);
  const pathFor=run=>prefix+run.path.split('/').map(encodeURIComponent).join('/');
  const $=id=>document.getElementById(id);
  const viewer=$('viewer'),slot=$('frame-slot'),sourceDialog=$('source-dialog');
  let active=null,returnFocus=null,sourceRequest=0,viewerRequest=0;
  function announce(text){$('announcement').textContent=text;}
  function selectEffort(effort,update=true){
    if(!runs.some(r=>r.effort===effort)) return;
    document.querySelectorAll('[data-pair]').forEach(el=>el.hidden=el.dataset.pair!==effort);
    document.querySelectorAll('[data-effort]').forEach(el=>el.setAttribute('aria-current',String(el.dataset.effort===effort)));
    if(update){const u=new URL(location.href);u.searchParams.set('run',runs.find(r=>r.effort===effort&&r.model==='Astra').id);u.hash='';history.replaceState(null,'',u);}
  }
  function unloadFrame(){
    const frame=slot.querySelector('iframe');if(!frame)return Promise.resolve();
    // Navigate while the viewport is still attached. Some originals draw in
    // their resize handlers and cannot handle a transient zero-sized viewport.
    return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timeout);frame.removeEventListener('load',finish);frame.remove();resolve();};const timeout=setTimeout(finish,500);frame.addEventListener('load',finish,{once:true});frame.src='about:blank';});
  }
  async function loadRun(run){
    const request=++viewerRequest;await unloadFrame();if(request!==viewerRequest||!viewer.open)return;active=run;
    $('viewer-title').textContent=run.model+' / '+run.effort;
    $('viewer-original').href=pathFor(run);
    document.querySelectorAll('[data-switch]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.switch===run.model)));
    const frame=document.createElement('iframe');frame.title=run.model+' '+run.effort+' original simulation';frame.setAttribute('sandbox','allow-scripts');slot.append(frame);
    // Establish a real viewport before the original script can initialise.
    // A detached or newly opened dialog can otherwise report zero dimensions.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(request!==viewerRequest||!viewer.open||!frame.isConnected)return;
    frame.src=pathFor(run);
    selectEffort(run.effort,false);
    if(document.querySelector('[data-experiment]')){const u=new URL(location.href);u.searchParams.set('run',run.id);history.replaceState(null,'',u);}
    syncPreview();
  }
  function openRun(run,trigger){
    returnFocus=trigger || document.activeElement;
    if(!viewer.open) viewer.showModal();syncPreview();loadRun(run);$('viewer-close').focus();
  }
  function stop(){slot.replaceChildren();active=null;syncPreview();returnFocus?.focus();}
  async function closeViewer(){const request=++viewerRequest;await unloadFrame();if(request===viewerRequest)viewer.close();}
  viewer.addEventListener('close',stop);
  $('viewer-close').addEventListener('click',closeViewer);
  $('viewer-exit').addEventListener('click',closeViewer);
  viewer.addEventListener('cancel',event=>{event.preventDefault();closeViewer();});
  $('viewer-restart').addEventListener('click',()=>active&&loadRun(active));
  document.querySelectorAll('[data-switch]').forEach(button=>button.addEventListener('click',()=>{if(active)loadRun(runs.find(r=>r.effort===active.effort&&r.model===button.dataset.switch));}));
  document.querySelectorAll('[data-play]').forEach(link=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const run=find(link.dataset.play);if(run){event.preventDefault();openRun(run,link);}}));
  document.querySelectorAll('[data-effort]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();selectEffort(link.dataset.effort);}));
  document.querySelectorAll('[data-source]').forEach(link=>link.addEventListener('click',async event=>{
    event.preventDefault();const token=++sourceRequest,run=find(link.dataset.source);$('source-content').textContent='Loading original source…';sourceDialog.showModal();
    try{const response=await fetch(pathFor(run));if(!response.ok)throw Error('Source unavailable');const text=await response.text();if(token===sourceRequest)$('source-content').textContent=text;}
    catch{if(token===sourceRequest)$('source-content').textContent='The source could not be loaded. Use Download or Open original to access the file.';}
  }));
  $('source-close').addEventListener('click',()=>sourceDialog.close());
  sourceDialog.addEventListener('close',()=>sourceRequest++);
  const requested=new URL(location.href).searchParams.get('run');
  const selected=find(requested)||find(experiment.featured);
  if(document.body.dataset.page==='context'&&requested&&!['#prompt','#method'].includes(location.hash)){const destination=new URL(prefix,location.href);destination.searchParams.set('run',find(requested)?.id||experiment.featured);destination.hash='results';location.replace(destination);return;}
  selectEffort(selected.effort,false);
  if(requested&&!find(requested)&&$('selection-error')){$('selection-error').hidden=false;$('selection-error').textContent='That result link is not recognised. Showing the Ultra pair.';}
  function updatePrompt(){
    const run=find($('prompt-run').value),mode=$('prompt-mode').value;
    const templates=experiment.promptTemplates;
    $('prompt-text').textContent=mode==='historical'&&run.promptVariant==='original'?templates.original:templates.named.replace('You are '+templates.label+' and',`You are ${run.model}-${run.effort} and`);
    $('prompt-context').textContent=mode==='historical'&&run.promptVariant==='original' ? `${run.model} ${run.effort} used the original brief, before the naming paragraph was added.` : `${run.model} ${run.effort}: original brief plus the naming paragraph. Only the model and effort label changes.`;
    $('copy-status').textContent='';
  }
  if($('prompt-run')){
    $('prompt-run').value=selected.id;updatePrompt();
    $('prompt-details').open=location.hash==='#prompt';
    $('prompt-run').addEventListener('change',updatePrompt);$('prompt-mode').addEventListener('change',updatePrompt);
    document.querySelectorAll('[data-prompt-run]').forEach(link=>link.addEventListener('click',()=>{$('prompt-run').value=link.dataset.promptRun;updatePrompt();$('prompt-details').open=true;}));
    window.addEventListener('hashchange',()=>{if(location.hash==='#prompt')$('prompt-details').open=true;});
    $('copy-prompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('prompt-text').textContent);$('copy-status').textContent='Copied.';}catch{$('prompt-details').open=true;$('copy-status').textContent='Select and copy the prompt below.';}});
  }
  const video=$('ambient-preview'),toggle=$('preview-toggle');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false,previewReady=false,wantsMotion=!motion.matches&&!navigator.connection?.saveData;
  function syncPreview(){
    if(!video)return;
    const playing=previewReady&&wantsMotion&&visible&&!document.hidden&&!viewer.open;
    if(playing){if(!video.src)video.src=matchMedia('(max-width: 800px)').matches&&video.dataset.mobileSrc?video.dataset.mobileSrc:video.dataset.src;video.play().catch(()=>{wantsMotion=false;toggle.textContent='Play preview';toggle.setAttribute('aria-pressed','false');});}else video.pause();
    toggle.textContent=playing?'Pause preview':'Play preview';toggle.setAttribute('aria-pressed',String(playing));
  }
  if(video){
    const ready=()=>{previewReady=true;syncPreview();};
    if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.1;syncPreview();},{threshold:[0,.1]}).observe(video.parentElement);
    toggle.addEventListener('click',()=>{wantsMotion=!wantsMotion;syncPreview();});
    motion.addEventListener('change',()=>{wantsMotion=!motion.matches&&!navigator.connection?.saveData;syncPreview();});
    document.addEventListener('visibilitychange',syncPreview);
    video.addEventListener('error',()=>{video.hidden=true;wantsMotion=false;toggle.hidden=true;});
  }
  window.addEventListener('pagehide',()=>{slot.replaceChildren();video?.pause();});
})();
