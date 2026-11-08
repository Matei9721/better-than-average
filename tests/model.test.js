import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges} from '../data.js';
import {createState, counts, filterChallenges, makeCustomChallenge, passesTarget, recordAttempt, toggleGoal} from '../model.js';

test('study mean uses a strict comparison and personal targets have their stated boundary',()=>{
  const study=challenges.find(item=>item.id==='typing');
  assert.equal(passesTarget(study,52),false);
  assert.equal(passesTarget(study,52.1),true);
  const reflexes=challenges.find(item=>item.id==='reflexes');
  assert.equal(passesTarget(reflexes,300),false);
  assert.equal(passesTarget(reflexes,299),true);
  assert.equal(passesTarget(challenges.find(item=>item.id==='juggle'),20),true);
});

test('repeat attempts count a skill once and a later failed attempt preserves the dated win',()=>{
  const state=createState(challenges);
  assert.equal(recordAttempt(state,'typing',{value:63}).newWin,true);
  const achieved=state.records.get('typing').achieved;
  recordAttempt(state,'typing',{value:70});
  recordAttempt(state,'typing',{value:40});
  recordAttempt(state,'juggle',{value:20});
  assert.deepEqual(counts(state),{benchmark:1,personal:1,goals:0});
  assert.equal(state.records.get('typing').achieved,achieved);
  assert.equal(state.records.get('typing').attempts.length,3);
});

test('invalid results do not create a goal, attempt, or achievement',()=>{
  const state=createState(challenges);
  for(const value of ['', ' ', 'oops', -1, Infinity, NaN]) assert.throws(()=>recordAttempt(state,'typing',{value}));
  assert.equal(state.records.size,0);
  toggleGoal(state,'typing');recordAttempt(state,'typing',{value:45});
  assert.deepEqual(counts(state),{benchmark:0,personal:0,goals:1});
});

test('combined search, category and type filters use the same catalogue',()=>{
  assert.deepEqual(filterChallenges(challenges,{category:'digital',query:'study',type:'benchmark'}).map(item=>item.id),['typing']);
  assert.equal(filterChallenges(challenges,{category:'move',type:'benchmark'}).length,0);
});

test('editing a sourced challenge makes a personal definition and does not reuse its source',()=>{
  const original=challenges.find(item=>item.id==='typing');
  const custom=makeCustomChallenge({...original,target:60,direction:'at-least'});
  assert.equal(custom.type,'personal');assert.equal(custom.source,undefined);
  assert.notEqual(custom.id,original.id);assert.equal(custom.target,60);
});
