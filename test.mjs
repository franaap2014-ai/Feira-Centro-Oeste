import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
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

const requiredModules=['app.js','backend.js','music.js','auth-ui.js','admin-music.js','questions.js'];
const buildSource=readFileSync('build.mjs','utf8');
for(const file of requiredModules){
 assert.ok(buildSource.includes("'"+file+"'"),'O build precisa publicar '+file);
 execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
}
const appSource=readFileSync('app.js','utf8');
assert.ok(appSource.includes("./guest.js")&&appSource.includes("./admin-music.js"));
assert.ok(readFileSync('guest.js','utf8').includes('initGuestUI'));
console.log('✓ Arquivos novos incluidos no build e sintaxe JavaScript conferida.');


// The customizable bank can contain many topics and extra questions.
const {makeFlexibleSession}=await import('./questions.js');
for(let i=0;i<1200;i++){
 const mock=questions.map((q,index)=>({...q,topicId:index%7===0?'topic-1':index%7===1?'topic-2':null,active:true}));
 const round=makeFlexibleSession(mock);
 assert.equal(round.length,5);
 assert.equal(new Set(round.map(q=>q.id)).size,5);
 for(const q of round)assert.equal(q.answers.filter(a=>a.correct).length,1);
}
console.log('✓ 1.200 jogos extras com tópicos personalizados.');


// Cadastro comum sem email, separado do painel administrativo.
const entryHTML=readFileSync('index.html','utf8');
assert.ok(entryHTML.includes('id="guestAccessDialog"'));
assert.ok(entryHTML.includes('id="loginDialog"'));
const guestCode=readFileSync('guest.js','utf8');
for(const text of ['Criar conta','Repetir senha','Já tem uma conta?','Acesso de ADM','guestPasswordRepeat','quiz_guest_register']){
 if(text==='quiz_guest_register')assert.ok(readFileSync('backend.js','utf8').includes(text));
 else assert.ok(guestCode.includes(text),'Cadastro precisa incluir '+text);
}
for(const filename of ['guest.js','backend.js']){
 execFileSync(process.execPath,['--check',filename],{stdio:'pipe'});
}
console.log('✓ Cadastro username/senha, repetição, entrada e ADM separados.');


// ADM: escolha a senha no próprio site, com um link único, sem email.
const adminJS=readFileSync('app.js','utf8');
const adminHTML=readFileSync('index.html','utf8');
const backendJS=readFileSync('backend.js','utf8');
for(const name of ['adminSetupDialog','adminSetupPassword','adminSetupConfirm','adminSetupSubmit']){
 assert.ok(adminHTML.includes('id="'+name+'"'),name+' ausente no formulário');
}
assert.ok(adminHTML.includes('Criar senha'));
assert.ok(adminHTML.includes('Confirme sua senha'));
assert.ok(adminJS.includes("params.get('adm_setup')"));
assert.ok(adminJS.includes("await saveAdminSetupPassword(setupToken,password)"));
assert.ok(backendJS.includes("'/functions/v1/admin-password-setup'"));
assert.ok(!adminJS.includes("requestPasswordReset("),'Não enviar email para criar senha');
assert.ok(!adminJS.includes('setupAdminPasswordRecovery()'));
assert.ok(!adminHTML.includes('localhost:3000'));
assert.ok(!adminHTML.includes('tkDJY%q!vNky4ZKtVZ8FzY'));
console.log('✓ Criação privada de senha ADM dentro do site, sem e-mail.');
