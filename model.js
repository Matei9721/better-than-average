export function createState(catalogue) {
  return { challenges: catalogue.map(item => ({...item})), records: new Map() };
}

export function passesTarget(challenge, value) {
  if (!validResult(challenge,value)) return false;
  if (challenge.direction === 'under') return value < challenge.target;
  if (challenge.direction === 'over') return value > challenge.target;
  return value >= challenge.target;
}

function validResult(challenge,value) {
  return Number.isFinite(value) && value >= 0 &&
    (challenge.max === undefined || value <= challenge.max) &&
    (!challenge.integer || Number.isInteger(value)) &&
    (!challenge.resultOptions || challenge.resultOptions.some(option=>option.value===value));
}

export function parseResult(challenge,input) {
  const text=String(input).trim();
  if(!text)throw new Error('Enter your result.');
  if(challenge.input==='duration') {
    const match=/^(\d+):([0-5]\d)$/.exec(text);
    if(!match)throw new Error('Enter a time as minutes:seconds, such as 29:45.');
    return Number(match[1])*60+Number(match[2]);
  }
  return Number(text);
}

export function resultLabel(challenge,value) {
  if(challenge.resultOptions)return challenge.resultOptions.find(option=>option.value===value)?.label || '';
  if(challenge.input==='duration')return `${Math.floor(value/60)}:${String(Math.round(value%60)).padStart(2,'0')}`;
  return `${value} ${challenge.unit}`;
}

export function recordAttempt(state, id, input) {
  const challenge = state.challenges.find(item => item.id === id);
  if (!challenge) throw new Error('Challenge not found.');
  const value = parseResult(challenge,input.value);
  if (!validResult(challenge,value)) throw new Error(challenge.resultOptions?'Choose a rank from the list.':`Enter ${challenge.integer?'a whole-number':'a valid'} result from 0${challenge.max!==undefined?` to ${challenge.max}`:''}.`);
  const previous = state.records.get(id) || { attempts: [], goal: false, won: false };
  const passed = passesTarget(challenge, value);
  const attempt = { value, note: String(input.note || '').slice(0,400), proof: String(input.proof || '').slice(0,800), date: new Date().toISOString() };
  const record = { ...previous, goal: true, won: previous.won || passed, deadline: input.deadline || '', attempts: [...previous.attempts, attempt], achieved: previous.achieved || (passed ? attempt.date : null) };
  state.records.set(id, record);
  return { record, passed, newWin: passed && !previous.won };
}

export function toggleGoal(state, id) {
  const previous = state.records.get(id) || {attempts: [], goal: false, won: false};
  previous.goal = !previous.goal;
  state.records.set(id, previous);
  return previous.goal;
}

export function counts(state) {
  return state.challenges.reduce((total, item) => {
    const record = state.records.get(item.id);
    if (record?.won) total[item.type === 'benchmark' ? 'benchmark' : 'personal']++;
    else if (record?.goal) total.goals++;
    return total;
  }, {benchmark:0, personal:0, goals:0});
}

export function targetLabel(challenge) {
  if(challenge.targetText)return challenge.targetText;
  const prefix = challenge.direction === 'under' ? 'Under' : challenge.direction === 'over' ? 'Above' : '';
  if(challenge.resultOptions)return `${resultLabel(challenge,challenge.target)} or higher`;
  if(challenge.input==='duration')return `${prefix} ${resultLabel(challenge,challenge.target)}`.trim();
  return `${prefix ? prefix+' ' : ''}${challenge.target} ${challenge.unit}`;
}

export function filterChallenges(catalogue, {category='all', query='', type='all'} = {}) {
  const text=query.trim().toLowerCase();
  return catalogue.filter(item=>(category==='all' || item.category===category) &&
    (type==='all' || item.type===type || (type==='study'&&item.type==='benchmark'&&item.source?.kind!=='rank') || (type==='rank'&&item.source?.kind==='rank')) &&
    (!text || `${item.title} ${item.description} ${item.category} ${item.unit} ${item.source?.cohort||''}`.toLowerCase().includes(text)));
}

export function makeCustomChallenge(input, originalId='', template=null) {
  const title=String(input.title || '').trim().slice(0,55);
  const target=Number(input.target);
  const unit=String(input.unit || '').trim().slice(0,22);
  const instructions=String(input.instructions || '').trim().slice(0,400);
  if (!title || !unit || !instructions || !Number.isFinite(target) || (template?.resultOptions?target<0:target<=0)) throw new Error('Add a name, a positive target, a unit, and a clear rule.');
  if(template?.resultOptions&&!template.resultOptions.some(option=>option.value===target))throw new Error('Choose a target rank.');
  const format=template?.resultOptions?{resultOptions:template.resultOptions.map(option=>({...option})),integer:true}:template?.input==='duration'?{input:'duration',integer:true}:{};
  return {id:originalId || `custom-${globalThis.crypto.randomUUID()}`, title, target, unit, instructions, category:input.category, direction:template?.resultOptions?'at-least':input.direction==='under'?'under':'at-least', type:'personal', icon:'flag', time:'', description:instructions.length>110?`${instructions.slice(0,107).trimEnd()}…`:instructions, custom:true,...format};
}
