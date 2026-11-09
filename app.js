import {categories, challenges as initialChallenges} from './data.js';
import {createState, counts, filterChallenges, makeCustomChallenge, recordAttempt, resultLabel, targetLabel, toggleGoal} from './model.js';
import {createPassport} from './passport.js';

const $ = (selector, scope=document) => scope.querySelector(selector);
const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const paths = {
  spark:'<path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  grid:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
  flag:'<path d="M5 22V3m0 0c5-4 9 4 14 0v11c-5 4-9-4-14 0"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  shuffle:'<path d="M3 6h3c5 0 7 12 12 12h3M3 18h3c2 0 4-3 6-6s4-6 6-6h3m-3-3 3 3-3 3m0 6 3 3-3 3"/>',
  moon:'<path d="M20.5 13.5A9 9 0 0 1 10.5 3.4 9 9 0 1 0 20.5 13.5Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  bookmark:'<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4Z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  study:'<path d="M4 3h12a2 2 0 0 1 2 2v15H6a2 2 0 0 1-2-2Zm0 14h14M8 7h6M8 11h4M21 4v13"/>',
  passport:'<rect x="5" y="2" width="15" height="20" rx="2"/><path d="M8 2v20M12 18h5"/><circle cx="14" cy="9" r="3"/><path d="M11 9h6m-3-3a7 7 0 0 1 0 6m0-6a7 7 0 0 0 0 6"/>',
  barbell:'<path d="M6 12h12M3 8v8m3-11v14M18 5v14m3-11v8M1 12h2m18 0h2"/>',
  crosshair:'<circle cx="12" cy="12" r="7"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/>',
  rotate:'<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
  move:'<path d="m5 17 4-4 3 1 3-7 4 3M4 21l5-3 3 2 5-5M9 5l3 2 3-1"/><circle cx="17" cy="3" r="1.5"/>',
  brain:'<path d="M9 18a3 3 0 0 1-5-2 4 4 0 0 1-1-7 4 4 0 0 1 6-5 3 3 0 0 1 3-2v20a4 4 0 0 1-3-4Zm6 0a3 3 0 0 0 5-2 4 4 0 0 0 1-7 4 4 0 0 0-6-5 3 3 0 0 0-3-2M8 8a4 4 0 0 0 4 4m4-4a4 4 0 0 1-4 4M7 15h2m6 0h2"/>',
  scissors:'<circle cx="5" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><path d="m7 7 14 14M7 17 21 3M9 12l3-3"/>',
  dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r=".8"/><circle cx="16" cy="8" r=".8"/><circle cx="12" cy="12" r=".8"/><circle cx="8" cy="16" r=".8"/><circle cx="16" cy="16" r=".8"/>',
  keyboard:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 15h10"/>',
  music:'<path d="M9 18V5l12-3v13M9 9l12-3"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="15" rx="3" ry="3"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
  juggle:'<circle cx="12" cy="4" r="2.5"/><circle cx="4" cy="11" r="2.5"/><circle cx="20" cy="11" r="2.5"/><path d="m4 19 4 2 4-5m8 3-4 2-4-5M2 4l2-2m16 0 2 2"/>',
  chef:'<path d="M6 14a5 5 0 0 1-1-10 5 5 0 0 1 8-1 5 5 0 0 1 5 1 5 5 0 0 1 0 10v7H6Zm0 3h12M9 10v3m6-3v3"/>',
  balance:'<circle cx="12" cy="3" r="2"/><path d="m5 8 7 1 7-1M12 5v9m0 0-6 7m6-7 6 4 3-3"/>',
  paper:'<path d="m2 10 20-8-8 20-4-8Zm8 4L22 2M2 10l9 1"/>',
  cube:'<path d="m12 2 9 5v10l-9 5-9-5V7Zm0 10 9-5M12 12 3 7m9 5v10M7.5 4.5l9 5M7.5 9.5v10m9-10v10M3 12l9 5 9-5"/>',
  bird:'<path d="M3 17c6 0 6-8 11-9-1-3 2-6 5-4l2 2-3 1v7c0 4-5 6-11 5Zm0 0L1 20M9 13l5 1m-3 5v3m4-3v3"/><circle cx="17" cy="5.5" r=".4"/>',
  knot:'<path d="M8 8C2 2-2 12 7 15l10 3c8 2 9-8 2-9L8 6C1 4 0 14 6 16l11 4M9 9l7 7m-3-8 3 3m-7 2 3 3"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7Zm-10 10 10 5 10-5M2 17l10 5 10-5"/>',
  bike:'<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 5 9H5m5-9h7l2 9M8 5h4m3-2h3l2 5"/>',
  command:'<path d="M9 9V5a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z"/>',
  rhythm:'<path d="M3 12h3l3-8 6 16 3-8h3"/>',
  rope:'<path d="M6 4v12a6 6 0 0 0 12 0V4M4 2h4v6H4m12-6h4v6h-4"/>',
  pen:'<path d="m15 3 6 6-12 12H3v-6Zm-10 12 6 6m2-16 6 6M3 21h18"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
  leaf:'<path d="M20 3c1 11-3 17-10 15C0 15 6 5 20 3ZM4 21l11-11m-7 7v-6m4 2h5"/>',
  cards:'<rect x="7" y="3" width="13" height="18" rx="2"/><path d="m7 6-3-1-3 15 6 1m7-13-3 4 3 4 3-4Z"/>',
  headphones:'<path d="M3 14v-2a9 9 0 0 1 18 0v2M3 14h4v7H5a2 2 0 0 1-2-2Zm18 0h-4v7h2a2 2 0 0 0 2-2Z"/>',
  mountain:'<path d="m2 21 8-17 5 10 3-6 5 13ZM7 10l3 3 3-3M1 21h22"/>',
};
function icon(name) {return `<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;}
function hydrateIcons(scope=document) {$$('[data-icon]',scope).forEach(node=>{node.innerHTML=icon(node.dataset.icon);});}
const categoryName=id=>categories.find(category=>category.id===id)?.name || 'Personal';
let state=createState(initialChallenges);
let view='explore', passportTab='goals';
let filters={category:'all', query:'', type:'all'};
let currentId=null, toastTimer=null, game=null, manualTheme=false, createTemplate=null;
const detailDialog=$('#challenge-dialog');
const createDialog=$('#create-dialog');
const passport=createPassport({icon, escape, resultLabel, categoryName, formatDate});

function renderTheme() {
  const dark=document.documentElement.dataset.theme==='dark';
  const button=$('#theme-toggle');
  button.innerHTML=icon(dark?'sun':'moon');
  button.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);
  button.setAttribute('aria-pressed',String(dark));
  $('meta[name="theme-color"]').content=dark?'#141a16':'#f6f7f2';
}
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
systemTheme.addEventListener('change',event=>{if(!manualTheme){document.documentElement.dataset.theme=event.matches?'dark':'light';renderTheme();}});

function toast(message) {
  clearTimeout(toastTimer);
  const element=$('#toast');element.textContent=message;element.classList.add('visible');
  toastTimer=setTimeout(()=>element.classList.remove('visible'),3300);
}
function celebrate() {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const layer=$('#celebration');
  layer.replaceChildren();
  for(let index=0;index<24;index++) {
    const piece=document.createElement('span');piece.className='confetti-piece';
    piece.style.setProperty('--piece-color',['#d5ef83','#e5c4eb','#f0b485','#a7c6ba'][index%4]);
    piece.style.setProperty('--dx',`${(Math.random()-.5)*650}px`);
    piece.style.setProperty('--dy',`${100+Math.random()*450}px`);
    piece.style.setProperty('--rotation',`${Math.random()*700-350}deg`);
    piece.addEventListener('animationend',()=>piece.remove(),{once:true});layer.append(piece);
  }
}
function renderCategories() {
  $('#categories').innerHTML=categories.map(category=>`<button class="category-chip" type="button" data-category-filter="${category.id}" aria-pressed="${category.id===filters.category}">${icon(category.icon)}${category.name}</button>`).join('');
}
const comparisonKind=challenge=>challenge.type!=='benchmark'?'personal':challenge.source?.kind==='rank'?'rank':'study';
const comparisonLabel=challenge=>({study:'Study based',rank:'Rank data',personal:'Personal target'}[comparisonKind(challenge)]);
function resultInput(challenge,latest) {
  if(challenge.resultOptions)return `<select id="attempt-value" name="value" required><option value="">Choose your rank</option>${challenge.resultOptions.map(option=>`<option value="${option.value}" ${latest?.value===option.value?'selected':''}>${escape(option.label)}</option>`).join('')}</select>`;
  const duration=challenge.input==='duration';
  const value=latest?(duration?resultLabel(challenge,latest.value):latest.value):'';
  return `<input id="attempt-value" name="value" type="${duration?'text':'number'}" ${duration?'':`min="0" step="${challenge.integer?'1':'any'}" inputmode="${challenge.integer?'numeric':'decimal'}" ${challenge.max!==undefined?`max="${challenge.max}"`:''}`} required placeholder="${escape(duration?resultLabel(challenge,challenge.target):challenge.target)}" value="${escape(value)}">`;
}
function card(challenge) {
  const record=state.records.get(challenge.id);
  const saved=Boolean(record?.goal);
  const latest=record?.attempts.at(-1);
  const kind=comparisonKind(challenge);
  return `<article class="challenge-card" data-category="${escape(challenge.category)}" data-comparison="${kind}">
    <div class="card-top"><span class="challenge-icon">${icon(challenge.icon)}</span><button type="button" class="bookmark-button" data-goal="${escape(challenge.id)}" aria-label="${saved?'Remove':'Save'} ${escape(challenge.title)} ${saved?'from':'to'} goals" aria-pressed="${saved}">${icon(record?.won?'check':'bookmark')}</button></div>
    <div class="card-labels"><span class="category-name">${categoryName(challenge.category)}</span><span class="comparison-badge comparison-${kind}">${icon(kind==='personal'?'flag':kind==='rank'?'layers':'study')}${comparisonLabel(challenge)}</span>${record?.won?'<span class="card-tag">Completed</span>':challenge.tag?`<span class="card-tag">${escape(challenge.tag)}</span>`:''}</div>
    <h3 class="card-title"><button type="button" data-open="${escape(challenge.id)}">${escape(challenge.title)}</button></h3>
    <p class="card-description">${escape(challenge.description)}</p>
    ${challenge.source?`<div class="card-comparison"><span>Compared with</span><p>${escape(challenge.source.cohort)}</p><a href="${escape(challenge.source.url)}" target="_blank" rel="noopener noreferrer">${escape(challenge.source.shortTitle||challenge.source.title)} · ${escape(challenge.source.year)} <span aria-hidden="true">↗</span></a></div>`:''}
    <div class="card-bottom"><div><div class="card-target">${escape(targetLabel(challenge))}</div><div class="card-type">${challenge.type==='benchmark'?'Reference target':'Your own goal'}${challenge.time?` <span aria-hidden="true">·</span> ${escape(challenge.time)}`:''}</div></div><button type="button" class="card-open" data-open="${escape(challenge.id)}" aria-label="Open ${escape(challenge.title)}">${icon('chevron')}</button></div>
    ${latest||record?.deadline?`<div class="card-record">${icon(record?.won?'check':'clock')}<span>${record?.won?'Completed · self-reported':latest?`Last result: ${escape(resultLabel(challenge,latest.value))}`:'Saved to goals'}${record?.deadline?` · Target: ${escape(formatDate(record.deadline))}`:''}</span></div>`:''}
  </article>`;
}
function formatDate(value) {return new Date(value.length===10?`${value}T12:00:00`:value).toLocaleDateString(undefined,{day:'numeric',month:'short'});}
function renderExplore() {
  const items=filterChallenges(state.challenges,filters);
  $('#results-count').innerHTML=`<strong>${items.length}</strong> ${items.length===1?'challenge':'challenges'}`;
  $('#challenge-grid').innerHTML=items.map(item=>card(item)).join('');
  $('#no-results').hidden=items.length>0;
  $$('[data-type-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.typeFilter===filters.type)));
}
function renderPassport() {
  passport.render(state);
  const totals=counts(state);
  $('#goals-tab-count').textContent=totals.goals;
  $('#wins-tab-count').textContent=totals.benchmark+totals.personal;
  $$('[data-passport-tab]').forEach(button=>{const selected=button.dataset.passportTab===passportTab;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
  const items=state.challenges.filter(item=>{const record=state.records.get(item.id);return passportTab==='wins'?record?.won:record?.goal&&!record?.won;});
  $('#passport-grid').innerHTML=items.map(item=>card(item)).join('');
  const empty=$('#passport-empty');empty.hidden=items.length>0;
  if(!items.length)empty.innerHTML=`<h3>${passportTab==='wins'?'No completed challenges yet':'No saved goals yet'}</h3><p>${passportTab==='wins'?'Record a passing result to add a challenge to your collection.':'Save a challenge to find it here.'}</p><button type="button" class="button button-primary" data-action="explore">Explore challenges</button>`;
}
function renderStats() {
  const totals=counts(state);
  $('#benchmark-count').textContent=String(totals.benchmark);
  $('#personal-count').textContent=String(totals.personal);
  $('#goal-count').textContent=String(totals.goals);
  const all=totals.benchmark+totals.personal+totals.goals;
  $('#nav-count').textContent=all;$('#nav-count').hidden=all===0;
}
function renderAll() {renderStats();renderExplore();renderPassport();}
function setView(next,scroll=true) {
  const entering=next==='passport'&&(view!=='passport'||$('#passport-view').hidden);
  view=next==='passport'?'passport':'explore';
  $('#hero').hidden=view==='passport';
  $('#explore-view').hidden=view!=='explore';$('#passport-view').hidden=view!=='passport';
  $('.page-wrap').classList.toggle('passport-mode',view==='passport');
  if(entering)passport.enter();
  else if(view!=='passport')passport.leave();
  $$('[data-nav]').forEach(link=>{const active=link.dataset.nav===view;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  if(scroll)requestAnimationFrame(()=>$(view==='explore'?'#hero':'#main').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
}
function navigate(next) {if(location.hash!==`#${next}`)history.pushState(null,'',`#${next}`);setView(next);}
window.addEventListener('popstate',()=>setView(location.hash==='#passport'?'passport':'explore',false));

function openDialog(dialog) {
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;
}
function closeDialog(dialog) {if(dialog?.open)dialog.close();}
$$('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();
  });
});
detailDialog.addEventListener('close',()=>stopGame());

function renderDetail() {
  const challenge=state.challenges.find(item=>item.id===currentId);if(!challenge)return;
  stopGame();
  const record=state.records.get(challenge.id);
  const latest=record?.attempts.at(-1);
  const best=record?.attempts.length ? (challenge.direction==='under'?Math.min:Math.max)(...record.attempts.map(attempt=>attempt.value)) : null;
  $('#detail-content').innerHTML=`
    <div data-category="${escape(challenge.category)}">
      <div class="dialog-topline"><div class="dialog-category"><span class="challenge-icon">${icon(challenge.icon)}</span><span class="small-eyebrow">${categoryName(challenge.category)}${challenge.time?` · ${escape(challenge.time)}`:''}</span></div><button class="icon-button" type="button" data-close aria-label="Close challenge">${icon('close')}</button></div>
      <h2 id="detail-title">${escape(challenge.title)}</h2>${challenge.custom?'':`<p class="dialog-lead">${escape(challenge.description)}</p>`}
      <div class="detail-meta"><span class="comparison-badge comparison-${comparisonKind(challenge)}">${icon(challenge.type==='benchmark'?'study':'flag')}${comparisonLabel(challenge)}</span>${challenge.source?`<span>${escape(challenge.source.cohort)}</span>`:''}</div>
      <div class="detail-target"><div><div class="small-eyebrow">TARGET</div><div class="target-value">${escape(targetLabel(challenge))}</div></div></div>
      <p class="instructions">${escape(challenge.instructions)}</p>
      ${challenge.source?`<details class="source-details"><summary>About this comparison</summary><p><strong>${escape(challenge.source.title)} · ${escape(challenge.source.year)}</strong><br>${escape(challenge.source.metric)}. ${escape(challenge.source.population)}</p>${challenge.source.note?`<p>${escape(challenge.source.note)}</p>`:''}<a href="${escape(challenge.source.url)}" target="_blank" rel="noopener noreferrer">${comparisonKind(challenge)==='rank'?'View rank distribution':'Read the research'} ↗</a></details>`:''}
      ${challenge.testUrl?`<a class="button button-outline external-test" href="${escape(challenge.testUrl)}" target="_blank" rel="noopener noreferrer">${escape(challenge.testLabel||'Take the test')} <span aria-hidden="true">↗</span></a>`:''}
      <div class="detail-actions"><button class="button button-outline" type="button" data-detail-goal="${escape(challenge.id)}" aria-pressed="${Boolean(record?.goal)}">${icon(record?.goal?'check':'bookmark')}<span>${record?.goal?'Saved to goals':'Save to goals'}</span></button><button class="text-button" type="button" data-customize="${escape(challenge.id)}">${challenge.custom?'Edit challenge':'Customize'} ${icon('chevron')}</button></div>
      ${challenge.game==='reaction'?`<section class="reaction-game" aria-label="Five-round reaction test"><div class="reaction-heading"><span>REACTION TEST</span><span id="reaction-round">5 rounds</span></div><button id="reaction-pad" class="reaction-pad" data-phase="idle" type="button"><strong>Start test</strong><span>Wait for green, then click or tap.</span></button><div id="reaction-result" class="reaction-result" hidden><p id="reaction-score"></p><button class="button button-outline" type="button" data-action="use-reaction">Use result</button></div><p class="reaction-help">Space or Enter also work.</p><span id="reaction-announcement" class="sr-only" role="status" aria-live="polite"></span></section>`:''}
      ${record?.won?`<div class="achieved-message"><strong>Challenge completed</strong><p>${escape(resultLabel(challenge,best))} · ${formatDate(record.achieved)} · Self-reported${challenge.type==='benchmark'?'<br>Reference target reached.':''}</p></div>`:''}
      <form id="attempt-form"><div class="form-heading"><h3>Record an attempt</h3></div><div class="form-columns"><label>Your result${challenge.resultOptions?'':` (${challenge.input==='duration'?'minutes:seconds':escape(challenge.unit)})`}${resultInput(challenge,latest)}</label><label>Target date <span class="form-optional">optional</span><input name="deadline" type="date" value="${escape(record?.deadline)}"></label></div><details class="proof-fields"><summary>Notes and evidence <span class="form-optional">optional</span></summary><label>Notes<textarea name="note" maxlength="400" rows="2" placeholder="Add a note about your attempt."></textarea></label><label>Evidence link<input name="proof" type="url" maxlength="800" placeholder="https://…"></label></details><p class="form-error" id="attempt-error" role="alert" hidden></p><button class="button button-primary full-width" type="submit">Save attempt</button></form>
      ${record?.attempts.length?`<section class="attempt-history"><h3>Recent attempts</h3>${[...record.attempts].reverse().slice(0,5).map(attempt=>`<div class="attempt-item"><div><strong>${escape(resultLabel(challenge,attempt.value))}</strong>${attempt.note?`<p>${escape(attempt.note)}</p>`:''}${attempt.proof?`<a href="${escape(attempt.proof)}" target="_blank" rel="noopener noreferrer">View evidence ↗</a>`:''}</div><time datetime="${attempt.date}">${formatDate(attempt.date)}</time></div>`).join('')}</section>`:''}
    </div>`;
  const deadlineLabel=$('input[name="deadline"]',detailDialog)?.closest('label');
  if(deadlineLabel) {
    const dateInput=$('input',deadlineLabel);
    deadlineLabel.replaceChildren();
    const labelText=document.createElement('span');
    labelText.innerHTML='Target date <span class="form-optional">optional</span>';
    deadlineLabel.append(labelText,dateInput);
  }
  if(record?.won) {
    const undo=document.createElement('button');
    undo.type='button';undo.className='text-button undo-stamp';undo.dataset.undo=challenge.id;
    undo.textContent='Undo stamp';$('.achieved-message',detailDialog).append(undo);
  }
  if(challenge.game==='reaction')initGame();
  if(detailDialog.open)$('.dialog-topline button',detailDialog).focus({preventScroll:true});
}
function openChallenge(id) {currentId=id;renderDetail();openDialog(detailDialog);}

function openCreate(id='') {
  const original=state.challenges.find(item=>item.id===id);
  createTemplate=original || null;
  const form=$('#create-form');form.reset();
  const targetField=form.elements.target;
  const replacement=document.createElement(original?.resultOptions?'select':'input');
  replacement.name='target';replacement.required=true;
  if(original?.resultOptions)replacement.innerHTML=original.resultOptions.map(option=>`<option value="${option.value}">${escape(option.label)}</option>`).join('');
  else {replacement.type='number';replacement.step='any';replacement.min='0.01';replacement.placeholder='10';}
  targetField.replaceWith(replacement);
  form.elements.direction.disabled=Boolean(original?.resultOptions);
  form.elements.unit.readOnly=Boolean(original?.resultOptions);
  form.elements.originalId.value=original?.custom?original.id:'';
  $('#create-title').textContent=original?.custom?'Edit challenge':original?'Customize challenge':'Create a challenge';
  $('#create-submit').textContent=original?.custom?'Save changes':'Create challenge';
  $('#create-type-note').hidden=original?.type!=='benchmark';
  if(original){for(const key of ['title','category','target','unit','instructions'])form.elements[key].value=original[key];form.elements.direction.value=original.direction==='under'?'under':'at-least';}
  $('#edit-notice')?.remove();
  if(original?.custom && state.records.get(original.id)?.attempts.length) {
    const notice=document.createElement('p');notice.id='edit-notice';notice.className='honesty-note edit-notice';
    notice.textContent='Changing the rules clears this challenge’s attempts and achievement.';
    form.prepend(notice);
  }
  closeDialog(detailDialog);openDialog(createDialog);
}

function stopGame() {if(game?.timer)clearTimeout(game.timer);game=null;}
function paintGame(title,subtitle,phase) {
  const pad=$('#reaction-pad');if(!pad)return;
  pad.dataset.phase=phase;pad.innerHTML=`<strong>${escape(title)}</strong><span>${escape(subtitle)}</span>`;
  $('#reaction-announcement').textContent=title;
}
function initGame() {
  game={phase:'idle',timer:null,times:[],readyAt:0};
  const pad=$('#reaction-pad');
  pad.addEventListener('keydown',event=>{if(event.repeat)event.preventDefault();});
  pad.addEventListener('click',()=>{
    if(!game)return;
    if(game.phase==='waiting'){
      clearTimeout(game.timer);game.phase='idle';paintGame('Too soon','Click to restart this round.','idle');return;
    }
    if(game.phase==='ready'){
      const elapsed=Math.round(performance.now()-game.readyAt);
      game.times.push(elapsed);
      if(game.times.length===5){
        game.phase='done';game.average=Math.round(game.times.reduce((total,value)=>total+value,0)/5);
        paintGame(`${game.average} ms`,'Average of five rounds.','result');
        $('#reaction-round').textContent='5 / 5 rounds';$('#reaction-score').textContent=`${game.times.join(' · ')} ms`;$('#reaction-result').hidden=false;
      }else{game.phase='idle';paintGame(`${elapsed} ms`,'Click for the next round.','result');$('#reaction-round').textContent=`${game.times.length} / 5 rounds`;}
      return;
    }
    if(game.phase==='done'){
      game.times=[];$('#reaction-result').hidden=true;$('#reaction-round').textContent='5 rounds';
    }
    game.phase='waiting';paintGame('Wait for green','Don’t click yet.','waiting');
    game.timer=setTimeout(()=>{
      if(!game||!detailDialog.open)return;
      game.phase='ready';paintGame('Now!','Click or tap.','ready');game.readyAt=performance.now();
    },1400+Math.random()*2200);
  });
}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&game&&['waiting','ready'].includes(game.phase)){
    clearTimeout(game.timer);game.phase='idle';paintGame('Round paused','Click to restart this round.','idle');
  }
});

document.addEventListener('click',event=>{
  const close=event.target.closest('[data-close]');
  if(close){closeDialog(close.closest('dialog'));return;}
  const nav=event.target.closest('[data-nav]');
  if(nav){event.preventDefault();navigate(nav.dataset.nav);return;}
  const brand=event.target.closest('.brand,.footer-brand');
  if(brand){event.preventDefault();navigate('explore');return;}
  const open=event.target.closest('[data-open]');
  if(open){openChallenge(open.dataset.open);return;}
  const goal=event.target.closest('[data-goal]');
  if(goal){const saved=toggleGoal(state,goal.dataset.goal);renderAll();toast(saved?'Saved to goals.':'Removed from goals.');return;}
  const detailGoal=event.target.closest('[data-detail-goal]');
  if(detailGoal){const saved=toggleGoal(state,detailGoal.dataset.detailGoal);detailGoal.setAttribute('aria-pressed',String(saved));detailGoal.innerHTML=`${icon(saved?'check':'bookmark')}<span>${saved?'Saved to goals':'Save to goals'}</span>`;renderAll();toast(saved?'Saved to goals.':'Removed from goals.');return;}
  const undo=event.target.closest('[data-undo]');
  if(undo){const record=state.records.get(undo.dataset.undo);record.won=false;record.achieved=null;renderAll();renderDetail();toast('Achievement removed. Attempts kept.');return;}
  const category=event.target.closest('[data-category-filter]');
  if(category){filters.category=category.dataset.categoryFilter;renderCategories();renderExplore();return;}
  const type=event.target.closest('[data-type-filter]');
  if(type){filters.type=type.dataset.typeFilter;renderExplore();return;}
  const passportButton=event.target.closest('[data-passport-tab]');
  if(passportButton){passportTab=passportButton.dataset.passportTab;renderPassport();return;}
  const customize=event.target.closest('[data-customize]');
  if(customize){openCreate(customize.dataset.customize);return;}
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(action==='theme'){manualTheme=true;document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';renderTheme();}
  else if(action==='about')openDialog($('#about-dialog'));
  else if(action==='create')openCreate();
  else if(action==='passport')navigate('passport');
  else if(action==='replay-passport')passport.enter();
  else if(action==='preview-passport')passport.preview();
  else if(action==='explore')navigate('explore');
  else if(action==='surprise'){
    const items=state.challenges.filter(item=>!state.records.get(item.id)?.won);
    const pool=items.length?items:state.challenges;openChallenge(pool[Math.floor(Math.random()*pool.length)].id);
  }
  else if(action==='clear-filters'){filters={category:'all',query:'',type:'all'};$('#search').value='';renderCategories();renderExplore();}
  else if(action==='reset')openDialog($('#reset-dialog'));
  else if(action==='confirm-reset'){
    state=createState(initialChallenges);filters={category:'all',query:'',type:'all'};passportTab='goals';$('#search').value='';renderCategories();renderAll();closeDialog($('#reset-dialog'));navigate('explore');toast('Progress reset.');
  }
  else if(action==='use-reaction'&&game?.average){$('#attempt-value').value=game.average;$('#attempt-value').focus();toast('Result added to your attempt.');}
});
$('#search').addEventListener('input',event=>{filters.query=event.target.value;renderExplore();});
document.addEventListener('submit',event=>{
  if(event.target.id==='attempt-form') {
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.target));
    try {
      if(data.proof){const url=new URL(data.proof);if(!['https:','http:'].includes(url.protocol))throw new Error('Use an https:// or http:// link for evidence.');data.proof=url.href;}
      const result=recordAttempt(state,currentId,data);renderAll();renderDetail();
      detailDialog.scrollTop=0;$('.dialog-topline button',detailDialog).focus({preventScroll:true});
      if(result.newWin){celebrate();toast('Challenge completed.');}
      else toast('Attempt saved.');
    }catch(error){const message=$('#attempt-error');message.textContent=error.message;message.hidden=false;}
  }else if(event.target.id==='create-form') {
    event.preventDefault();const form=event.target;
    const data=Object.fromEntries(new FormData(form));
    try{
      if(!categories.some(category=>category.id===data.category&&category.id!=='all'))throw new Error('Choose a category.');
      const item=makeCustomChallenge(data,data.originalId,createTemplate);
      if(data.originalId){const index=state.challenges.findIndex(challenge=>challenge.id===data.originalId);state.challenges[index]=item;state.records.delete(item.id);}
      else state.challenges.unshift(item);
      toggleGoal(state,item.id);closeDialog(createDialog);renderAll();openChallenge(item.id);toast(data.originalId?'Challenge updated.':'Challenge created.');
    }catch(error){toast(error.message);}
  }
});

$('#create-category').innerHTML=categories.filter(category=>category.id!=='all').map(category=>`<option value="${category.id}">${category.name}</option>`).join('');
hydrateIcons();renderTheme();renderCategories();renderAll();setView(location.hash==='#passport'?'passport':'explore',false);
