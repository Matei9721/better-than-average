// Anime.js drives compositor-friendly transforms; the passport is ordinary HTML.
export function createPassport({icon, escape, resultLabel, categoryName, formatDate}) {
  const $=selector=>document.querySelector(selector);
  const scene=$('#passport-scene'), book=$('#passport-book'), cover=$('#passport-cover');
  const stamps=$('#passport-stamps'), identity=$('#passport-identity'), page=$('#passport-stamp-page');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const compact=matchMedia('(max-width: 650px)');
  const animations=new Set();
  let currentState, sheet=0, examples=false, active=false, generation=0, waapi, lastWinCount=0;
  let library;
  const pad=value=>String(value).padStart(2,'0');
  const angles=[-7,5,4,-5];

  function stop() {
    generation++;
    for(const animation of animations)animation.revert();
    animations.clear();
    for(const element of [book,cover,...stamps.children]) {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    }
    scene.classList.remove('is-animating','is-settled');
  }
  function accessible(open) {
    page.inert=!open;
    identity.inert=!open;
  }
  function settle() {
    scene.classList.add('is-open');
    scene.classList.remove('is-animating');
    accessible(true);
    flattenIfFinished();
  }
  function flattenIfFinished() {
    if(active&&!scene.classList.contains('is-animating')&&!animations.size)scene.classList.add('is-settled');
  }
  function animate(element,parameters) {
    const complete=parameters.onComplete;
    const clearStyles=()=>{
      if(parameters.transform)element.style.removeProperty('transform');
      if(parameters.opacity)element.style.removeProperty('opacity');
    };
    let animation;
    animation=waapi.animate(element,{...parameters,onComplete:()=>{
      animation.revert();
      clearStyles();
      animations.delete(animation);
      complete?.();
      flattenIfFinished();
    }});
    // Anime.js commits styles in its asynchronous native cancel handler. Clear
    // them afterwards too, so interrupted openings keep using responsive CSS.
    for(const native of animation.animations)native.addEventListener('cancel',clearStyles,{once:true});
    animations.add(animation);
    return animation;
  }
  function revealStamps(delay=0) {
    if(!waapi||reduced.matches||!active)return;
    [...stamps.querySelectorAll('.achievement-stamp')].forEach((stamp,index)=>{
      animate(stamp,{transform:['translateY(10px) scale(.92)','translateY(0) scale(1)'],opacity:[0,1],duration:460,delay:delay+index*95,ease:'out(3)'});
    });
  }
  async function enter() {
    stop();active=true;
    const entry=generation;
    scene.classList.remove('is-open');
    accessible(false);
    if(reduced.matches){settle();return;}
    try {
      library ||= import('./assets/vendor/anime-waapi.js');
      ({waapi}=await library);
      if(!active||entry!==generation)return;
      const style=getComputedStyle(book);
      const from=style.getPropertyValue('--book-closed-transform').trim();
      const to=style.getPropertyValue('--book-open-transform').trim();
      scene.classList.add('is-open','is-animating');
      if(from!==to)animate(book,{transform:[from,to],duration:1200,ease:'cubic-bezier(.2,.7,.2,1)'});
      animate(cover,{transform:['rotateY(0deg)','rotateY(-180deg)'],duration:1200,delay:100,ease:'cubic-bezier(.3,0,.2,1)',onComplete:settle});
      revealStamps(1000);
    }catch(error) {
      // Content remains usable if animations are unavailable or fail to load.
      if(active&&entry===generation){stop();settle();}
      console.warn('Passport animation unavailable:',error);
    }
  }
  function leave() {stop();active=false;scene.classList.remove('is-open');accessible(false);}
  function entries() {
    if(examples) {
      return ['bench-press','juggle','typing','signature-dish'].map(id=>currentState.challenges.find(challenge=>challenge.id===id)).filter(Boolean).map(challenge=>({challenge,example:true}));
    }
    return currentState.challenges.filter(challenge=>currentState.records.get(challenge.id)?.won).map(challenge=>({challenge,record:currentState.records.get(challenge.id)})).sort((a,b)=>new Date(b.record.achieved)-new Date(a.record.achieved));
  }
  function stampMarkup({challenge,record,example},index) {
    const best=record?.attempts.length?(challenge.direction==='under'?Math.min:Math.max)(...record.attempts.map(attempt=>attempt.value)):null;
    const result=example?'EXAMPLE STAMP':resultLabel(challenge,best);
    const date=example?'KEEP GOING':formatDate(record.achieved);
    return `<button class="achievement-stamp stamp-${index%4}" type="button" data-category="${escape(challenge.category)}" style="--stamp-tilt:${angles[index%4]}deg" data-open="${escape(challenge.id)}" aria-label="${example?'Example: ':''}${escape(challenge.title)}${example?'':`, ${escape(result)}, completed ${escape(date)}`}. Open challenge."><span class="stamp-category">${escape(categoryName(challenge.category))} · ${challenge.type==='benchmark'?'REFERENCE':'PERSONAL'}</span>${icon(challenge.icon)}<strong title="${escape(challenge.title)}">${escape(challenge.title)}</strong><span class="stamp-result">${escape(result)}</span><span class="stamp-date">${escape(date)}</span></button>`;
  }
  function render(state=currentState) {
    currentState=state;
    const actual=state.challenges.filter(challenge=>state.records.get(challenge.id)?.won);
    if(actual.length!==lastWinCount){examples=false;sheet=0;}
    lastWinCount=actual.length;
    const items=entries(), pages=Math.max(1,Math.ceil(items.length/4));
    sheet=Math.min(sheet,pages-1);
    $('#passport-total-stamps').textContent=pad(actual.length);
    $('#passport-total-categories').textContent=pad(new Set(actual.map(challenge=>challenge.category)).size);
    $('#passport-page-number').textContent=pad(sheet+1);
    $('#passport-stamp-subtitle').textContent=examples?'Example stamps · a preview of what’s to come.':items.length?'Your achievements, self-reported and well earned.':'Every completed challenge leaves a mark.';
    stamps.innerHTML=items.length?items.slice(sheet*4,sheet*4+4).map(stampMarkup).join(''):`<div class="passport-first-stamp"><div class="first-stamp-seal" aria-hidden="true">${icon('compass')}<span>SO MUCH STILL TO TRY</span></div><h4>A blank page.<br>A world of possibilities.</h4><p>Complete your first challenge<br>to collect your first stamp.</p><button class="passport-paper-link" type="button" data-action="explore">Find your first challenge <span aria-hidden="true">↗</span></button></div>`;
    const pagination=$('#passport-pagination');pagination.hidden=pages===1;
    $('#passport-page-status').textContent=`${sheet+1} / ${pages}`;
    $('[data-passport-page="previous"]').disabled=sheet===0;
    $('[data-passport-page="next"]').disabled=sheet===pages-1;
    const preview=$('[data-action="preview-passport"]');
    preview.textContent=examples?'Back to my stamps':'Preview example stamps';
    preview.setAttribute('aria-pressed',String(examples));
    scene.classList.toggle('is-preview',examples);
  }
  $('#passport-experience').addEventListener('click',event=>{
    const button=event.target.closest('[data-passport-page]');
    if(button){sheet+=button.dataset.passportPage==='next'?1:-1;render();revealStamps();}
  });
  // Changing viewport or motion preferences during an opening must not leave a
  // committed desktop transform or an inaccessible, half-open cover behind.
  function finishForPreference() {if(active){stop();settle();}}
  reduced.addEventListener('change',finishForPreference);
  compact.addEventListener('change',finishForPreference);
  return {render,enter,leave,preview(){examples=!examples;sheet=0;render();revealStamps();}};
}
