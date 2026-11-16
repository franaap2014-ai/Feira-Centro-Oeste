import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {questions,categories,validateBank,makeSession,shuffle} from './questions.js';
assert.equal(validateBank(),true);
assert.equal(questions.length,30);
assert.equal(new Set(questions.map(q=>q.id)).size,30);
for(const category of categories){assert.equal(questions.filter(q=>q.category===category.id).length,category.id==='clima'?10:4)}
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
assert.equal(seen.size,30);assert.equal(correctPositions.size,4);assert.ok(orders.size>20);
assert.deepEqual(shuffle([1,2,3,4],()=>0),[2,3,4,1]);
console.log('✓ 30 questões válidas; 1.200 partidas simuladas; sorteio e respostas aprovados.');

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
assert.ok(adminHTML.includes('Crie sua senha'));
assert.ok(adminHTML.includes('Confirme sua senha'));
assert.ok(adminJS.includes("params.get('adm_setup')"));
assert.ok(adminJS.includes("await saveAdminSetupPassword(setupToken,password)"));
assert.ok(backendJS.includes("'/functions/v1/admin-password-setup'"));
assert.ok(!adminJS.includes("requestPasswordReset("),'Não enviar email para criar senha');
assert.ok(!adminJS.includes('setupAdminPasswordRecovery()'));
assert.ok(!adminHTML.includes('localhost:3000'));
assert.ok(!adminHTML.includes('tkDJY%q!vNky4ZKtVZ8FzY'));
console.log('✓ Criação privada de senha ADM dentro do site, sem e-mail.');


// Formulário ADM com três campos na ordem solicitada e autenticação obrigatória.
assert.ok(adminHTML.includes('id="loginEmail"'));
assert.ok(adminHTML.includes('id="admCreatePassword"'));
assert.ok(adminHTML.includes('id="admCreateConfirm"'));
const admSection=adminHTML.slice(adminHTML.indexOf('<dialog id="loginDialog"'),adminHTML.indexOf('<dialog id="adminSetupDialog"'));
assert.ok(admSection.indexOf('for="loginEmail"')<admSection.indexOf('for="admCreatePassword"'));
assert.ok(admSection.indexOf('for="admCreatePassword"')<admSection.indexOf('for="admCreateConfirm"'));
assert.ok(adminJS.includes("if(await getRole()==='admin')"));
assert.ok(adminJS.includes('await changeCurrentPassword(first)'));
assert.ok(adminJS.includes("setAdminMode('login')"));
console.log('✓ Email, criar senha, confirmar senha e acesso ADM com permissão verificada.');


// Novo acesso: identidade Google validada pelo Neon e senha salva via Supabase Auth.
assert.ok(adminHTML.includes('id="adminFirstAccessHelp"'));
assert.ok(adminHTML.includes('id="verifyAdminGoogle"'));
assert.ok(adminHTML.includes('Entrar com Google'));
assert.ok(adminJS.includes('checkGoogleVerification()'));
assert.ok(adminJS.includes('await setAdminPasswordFromGoogle(identity.token,first)'));
assert.ok(backendJS.includes("'/functions/v1/admin-google-password'"));
assert.ok(!adminHTML.includes('db3212e6-dd45-4dbd-8e18-e5dc8e9bc3c6'));
assert.ok(!adminHTML.includes('localhost:3000'));
const neonSource=readFileSync('neon-google.js','utf8');
assert.ok(neonSource.includes('@neon/auth@0.8.2'));
assert.ok(neonSource.includes('signIn.social'));
assert.ok(neonSource.includes("status:'wrong_account'"));
assert.ok(buildSource.includes("'neon-google.js'"));
execFileSync(process.execPath,['--check','neon-google.js'],{stdio:'pipe'});
console.log('✓ Google Neon verifica identidade antes de liberar criação da senha ADM.');


// O Pantanal substitui Brasília no tema e na ilustração inicial.
assert.equal(categories.length,6);
assert.equal(categories[5].id,'pantanal');
assert.equal(categories[5].label,'Pantanal');
assert.equal(questions.filter(q=>q.category==='pantanal').length,4);
assert.equal(questions.filter(q=>q.category==='brasilia').length,0);
assert.ok(readFileSync('index.html','utf8').includes('Paisagem do Pantanal com tuiuiú'));
assert.ok(!readFileSync('index.html','utf8').includes('Congresso Nacional de Brasília e paisagem'));
assert.ok(appSource.includes('30 no banco · 5 por partida'));
for(let i=0;i<1000;i++){
 const round=makeFlexibleSession(questions);
 assert.equal(round.length,5);
 assert.equal(new Set(round.map(q=>q.category)).size,5);
}
console.log('✓ Cinco perguntas por partida e seis temas, incluindo Clima fixo.');


// Homepage reformulada em rosa e branco, mantendo login, músicas e quiz.
assert.ok(appSource.includes('class="v3-hero"'));
assert.ok(appSource.includes('id="startBtn"'));
assert.ok(appSource.includes('id="startBottomBtn"'));
assert.ok(appSource.includes('id="como-jogar"'));
assert.ok(appSource.includes('O que vamos'));
assert.ok(appSource.includes('Pantanal'));
assert.ok(readFileSync('style.css','utf8').includes('HOME V3'));
assert.ok(readFileSync('index.html','utf8').includes('topbar topbar-v3'));
console.log('✓ Novo hero fotográfico do Pantanal, design responsivo e ações de jogo preservadas.');

assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL01');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual é o clima predominante na região Centro-Oeste?",["Equatorial","Tropical","Subtropical","Semiárido"],1,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL02');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Como são as estações do ano no Centro-Oeste?",["Verão seco e inverno chuvoso","Frio o ano inteiro","Verão chuvoso e inverno seco","Chuva durante todo o ano"],2,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL03');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual é o principal bioma da região Centro-Oeste?",["Amazônia","Caatinga","Pampa","Cerrado"],3,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL04');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual característica é comum na vegetação do Cerrado?",["Árvores baixas, troncos retorcidos e gramíneas","Árvores muito altas e folhas largas","Vegetação formada apenas por cactos","Florestas cobertas de neve"],0,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL05');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual bioma brasileiro é conhecido por suas áreas alagadas?",["Mata Atlântica","Pantanal","Caatinga","Pampa"],1,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL06');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual é uma característica do clima do Pantanal?",["Temperaturas muito baixas","Pouca variação de temperatura","Períodos de cheia e seca","Neve durante o inverno"],2,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL07');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual bioma também está presente na região Centro-Oeste, principalmente em Mato Grosso?",["Amazônia","Pampa","Caatinga","Mata de Araucárias"],0,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL08');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Por que muitas plantas do Cerrado possuem raízes profundas?",["Para alcançar água em camadas profundas do solo","Para sobreviver à neve","Para evitar o contato com o sol","Para viver dentro da água"],0,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL09');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Qual fenômeno natural é comum no Cerrado durante a estação seca?",["Nevascas","Geadas constantes","Tempestades de neve","Queimadas"],3,"clima",true]);
assert.deepEqual((()=>{const q=questions.find(x=>x.id==='CL10');return [q.text,q.options,q.correct,q.category,q.fixed]})(),["Quais são os três principais biomas encontrados na região Centro-Oeste?",["Caatinga, Pampa e Mata Atlântica","Cerrado, Pantanal e Amazônia","Pampa, Cerrado e Caatinga","Amazônia, Pampa e Caatinga"],1,"clima",true]);
assert.ok(readFileSync('backend.js','utf8').includes('if(isFixedClimateQuestion(q))return'));
assert.ok(readFileSync('studio.js','utf8').includes('studio-locked'));
console.log('✓ Dez perguntas de Clima são fixas e têm gabaritos iguais aos fornecidos.');
