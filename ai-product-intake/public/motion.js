
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced=()=>reduced.matches||document.body.classList.contains('reduce-motion');
  document.querySelectorAll('.product-hero h1').forEach(title=>{
    const split=node=>{[...node.childNodes].forEach(child=>{if(child.nodeType===3){const frag=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){frag.append(document.createTextNode(word));return;}const clip=document.createElement('span');clip.className='title-word-wrap';const span=document.createElement('span');span.className='title-word';span.textContent=word;clip.append(span);frag.append(clip);});child.replaceWith(frag);}else if(child.nodeType===1)split(child);});};
    title.setAttribute('aria-label',title.textContent);split(title);[...title.querySelectorAll('.title-word')].forEach((word,i)=>word.style.setProperty('--word-i',i));
  });
  document.querySelectorAll('.field,.metrics>div,.ledger-row,.rules>div').forEach((el,i)=>el.style.setProperty('--field-i',i%8));
  const clamp=(n)=>Math.max(0,Math.min(1,n));
  const ramp=(p,a,b)=>clamp((p-a)/(b-a));
  const stories=[...document.querySelectorAll('.motion-story')].map(el=>({el,stage:el.querySelector('.motion-stage'),p:0,target:0}));
  let frame=0;
  function paint(story){const p=story.p,s=story.stage;story.el.style.setProperty('--progress',p);const chapter=Math.min(2,Math.floor(p*3));story.el.querySelectorAll('.story-chapter').forEach((el,i)=>el.classList.toggle('is-current',i===chapter));
    if(story.el.dataset.story==='forma'){const form=ramp(p,.32,.55),fade=ramp(p,.16,.32),seal=ramp(p,.65,.9);s.style.setProperty('--raw-opacity',1-fade);s.style.setProperty('--raw-y',`${-form*25}px`);s.style.setProperty('--brief-opacity',form);s.style.setProperty('--brief-y',`${(1-form)*30}px`);s.style.setProperty('--seal-opacity',seal);s.style.setProperty('--seal-scale',.7+seal*.3);s.style.setProperty('--seal-angle',`${(1-seal)*-12}deg`);s.style.setProperty('--object-angle',`${(1-form)*-6}deg`);}
    if(story.el.dataset.story==='prism'){const wipe=ramp(p,.17,.68),metrics=ramp(p,.68,.9);s.style.setProperty('--wipe',wipe);s.style.setProperty('--clean-opacity',wipe>0?1:0);s.style.setProperty('--scan-opacity',wipe>0&&wipe<1?1:0);s.style.setProperty('--object-angle',`${(1-wipe)*-7}deg`);s.style.setProperty('--object-scale',.94+wipe*.06);s.style.setProperty('--metric-opacity',metrics);s.style.setProperty('--metric-y',`${(1-metrics)*12}px`);}
    if(story.el.dataset.story==='pet'){const open=ramp(p,.2,.42)*(1-ramp(p,.67,.92));const room=s.clientWidth;const shift=Math.min(248,room*.47);s.style.setProperty('--usage-opacity',open);s.style.setProperty('--usage-x',`${(1-open)*30}px`);s.style.setProperty('--usage-scale',.9+open*.1);s.style.setProperty('--pet-right',`${25+shift*open}px`);s.style.setProperty('--pet-scale',.76+open*.22);s.style.setProperty('--focus-opacity',1-open*.7);}
  }
  function measure(){for(const story of stories){if(isReduced()){story.p=story.target=1;paint(story);continue;}const rect=story.el.getBoundingClientRect();const total=story.el.offsetHeight-(innerHeight-64);story.target=clamp((64-rect.top)/Math.max(1,total));}if(!frame&&!isReduced())frame=requestAnimationFrame(tick);}
  function tick(){frame=0;let moving=false;for(const story of stories){const delta=story.target-story.p;story.p=Math.abs(delta)<.0007?story.target:story.p+delta*.12;paint(story);if(Math.abs(delta)>.0007)moving=true;}if(moving)frame=requestAnimationFrame(tick);}
  addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);document.getElementById('motion-toggle')?.addEventListener('change',measure);measure();
})();
