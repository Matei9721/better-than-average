import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges} from '../data.js';
import {createState, counts, filterChallenges, makeCustomChallenge, passesTarget, recordAttempt, resultLabel, toggleGoal} from '../model.js';

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
  assert.equal(filterChallenges(challenges,{category:'move',type:'study'}).length,7);
  assert.deepEqual(filterChallenges(challenges,{category:'play',type:'rank'}).map(item=>item.id),['cs-premier','league-rank']);
  assert.equal(filterChallenges(challenges,{category:'play',type:'study'}).length,0);
  assert.equal(filterChallenges(challenges,{category:'move',type:'personal',query:'rope'})[0].id,'jump-rope');
});

test('running times preserve strict boundaries and reject malformed time entries',()=>{
  const state=createState(challenges);
  assert.equal(recordAttempt(state,'run-5k',{value:'29:52'}).passed,false);
  assert.equal(recordAttempt(state,'run-5k',{value:'29:51'}).newWin,true);
  assert.equal(state.records.get('run-5k').attempts.at(-1).value,1791);
  assert.equal(resultLabel(challenges.find(item=>item.id==='run-5k'),1791),'29:51');
  for(const value of ['29:60','29.5','-1:30','0:2','oops'])assert.throws(()=>recordAttempt(state,'run-5k',{value}));
});

test('rank choices and bounded test scores cannot create impossible achievements',()=>{
  const state=createState(challenges);
  assert.equal(recordAttempt(state,'league-rank',{value:'13'}).passed,false);
  assert.equal(recordAttempt(state,'league-rank',{value:'14'}).passed,true);
  assert.equal(resultLabel(challenges.find(item=>item.id==='league-rank'),14),'Gold II');
  for(const value of ['', '14.5', '31'])assert.throws(()=>recordAttempt(state,'league-rank',{value}));
  for(const value of [21,14.5])assert.throws(()=>recordAttempt(state,'news-discernment',{value}));
  assert.equal(state.records.has('news-discernment'),false);
  assert.equal(recordAttempt(state,'news-discernment',{value:14}).newWin,true);
  assert.throws(()=>recordAttempt(state,'music-listening',{value:37}));
  assert.deepEqual(counts(state),{benchmark:2,personal:0,goals:0});
});

test('editing a sourced challenge makes a personal definition and does not reuse its source',()=>{
  const original=challenges.find(item=>item.id==='typing');
  const custom=makeCustomChallenge({...original,target:60,direction:'at-least'});
  assert.equal(custom.type,'personal');assert.equal(custom.source,undefined);
  assert.notEqual(custom.id,original.id);assert.equal(custom.target,60);
  const rank=challenges.find(item=>item.id==='league-rank');
  const personalRank=makeCustomChallenge({...rank,target:15},'',rank);
  assert.equal(personalRank.source,undefined);assert.equal(personalRank.type,'personal');
  assert.equal(resultLabel(personalRank,15),'Gold I');
  assert.equal(passesTarget(personalRank,14),false);
  const run=challenges.find(item=>item.id==='run-5k');
  const personalRun=makeCustomChallenge({...run,target:1800},'',run);
  const state=createState([personalRun]);
  assert.equal(recordAttempt(state,personalRun.id,{value:'29:59'}).newWin,true);
  assert.deepEqual(counts(state),{benchmark:0,personal:1,goals:0});
});
