import assert from 'node:assert/strict';
import {questions,categories,validateBank,makeSession,shuffle} from './questions.js';
assert.equal(validateBank(),true);
assert.equal(questions.length,40);
assert.equal(new Set(questions.map(q=>q.id)).size,40);
for(const category of categories){assert.equal(questions.filter(q=>q.category===category.id).length,8)}
for(const q of questions){assert.equal(q.options.length,4);assert.ok(q.correct>=0&&q.correct<=3);assert.equal(new Set(q.options).size,4)}
const seen=new Set(); const correctPositions=new Set(); const orders=new Set();
for(let n=0;n<1200;n++){
 const session=makeSession();
 assert.equal(session.length,5);
 assert.equal(new Set(session.map(q=>q.category)).size,5);
 assert.equal(new Set(session.map(q=>q.id)).size,5);
 for(const q of session){
  const answer=q.answers.find(a=>a.correct);
  assert.equal(q.answers.filter(a=>a.correct).length,1);
  assert.equal(answer.text,q.options[q.correct]);
  correctPositions.add(q.answers.findIndex(a=>a.correct));seen.add(q.id);
 }
 orders.add(session.map(q=>q.category).join(','));
}
assert.equal(seen.size,40);assert.equal(correctPositions.size,4);assert.ok(orders.size>20);
assert.deepEqual(shuffle([1,2,3,4],()=>0),[2,3,4,1]);
console.log('✓ 40 questões válidas (8 por tema); 1.200 partidas simuladas; sorteio e respostas aprovados.');
