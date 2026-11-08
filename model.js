export function createState(catalogue) {
  return { challenges: catalogue.map(item => ({...item})), records: new Map() };
}

export function passesTarget(challenge, value) {
  if (!Number.isFinite(value) || value < 0) return false;
  if (challenge.direction === 'under') return value < challenge.target;
  if (challenge.direction === 'over') return value > challenge.target;
  return value >= challenge.target;
}

export function recordAttempt(state, id, input) {
  const challenge = state.challenges.find(item => item.id === id);
  if (!challenge) throw new Error('Challenge not found.');
  const value = Number(input.value);
  if (String(input.value).trim() === '' || !Number.isFinite(value) || value < 0) throw new Error('Enter a positive result or zero.');
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
  const prefix = challenge.direction === 'under' ? 'Under' : challenge.direction === 'over' ? 'Above' : '';
  return `${prefix ? prefix+' ' : ''}${challenge.target} ${challenge.unit}`;
}

export function filterChallenges(catalogue, {category='all', query='', type='all'} = {}) {
  const text=query.trim().toLowerCase();
  return catalogue.filter(item=>(category==='all' || item.category===category) && (type==='all' || item.type===type) && (!text || `${item.title} ${item.description} ${item.category} ${item.unit}`.toLowerCase().includes(text)));
}

export function makeCustomChallenge(input, originalId='') {
  const title=String(input.title || '').trim().slice(0,55);
  const target=Number(input.target);
  const unit=String(input.unit || '').trim().slice(0,22);
  const instructions=String(input.instructions || '').trim().slice(0,400);
  if (!title || !unit || !instructions || !Number.isFinite(target) || target<=0) throw new Error('Add a name, a positive target, a unit, and a clear rule.');
  return {id:originalId || `custom-${globalThis.crypto.randomUUID()}`, title, target, unit, instructions, category:input.category, direction:input.direction==='under'?'under':'at-least', type:'personal', icon:'flag', time:'', description:instructions.length>110?`${instructions.slice(0,107).trimEnd()}…`:instructions, custom:true};
}
