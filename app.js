import {initMusic} from "./music.js";

import {renderAdminMusicPanel} from "./admin-music.js";
import {questions,categories,makeSession,makeFlexibleSession} from './questions.js';
import {getVisitor,clearVisitor,openGuestAccess,initGuestUI} from './guest.js';
import {renderStudio} from './studio.js';
import {configured,activeSession,getRole,signIn,signOut,saveAttempt,fetchAttempts,fetchOverrides,updateQuestion,loadQuizData,fetchParticipants,changeCurrentPassword} from './backend.js';
const root=document.getElementById('mainArea');
const loginDialog=document.getElementById('loginDialog');
const loginForm=document.getElementById('loginForm');
const escapeHTML=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={page:'home',questions:[],answers:[],index:0,busy:false,role:null,email:null,mode:'fair',attempts:[],topics:[],participants:[],filter:'fair',bank:questions.map(q=>({...q,options:[...q.options]})),bankReady:false,adminTab:'results',categoryFilter:'all',selectedQuestion:'G01',pageNumber:0,bankWarning:''};
const messages=['Não desanime! Que tal tentar novamente?','Boa tentativa! O Centro-Oeste tem muito para ensinar!','Bom trabalho! Continue descobrindo nossa região!','Muito bem! Você sabe bastante sobre o Centro-Oeste!','Excelente! Você conhece muito bem a região!','Incrível! Você é especialista no Centro-Oeste!'];
function setNav(){
 const btn=document.getElementById('adminEntry');
 btn.textContent=state.role==='admin'?'Painel ADM ↗':state.role==='operator'?'Modo Feira ↗':getVisitor()?getVisitor().username+' ↗':'Área de acesso ↗';
 btn.onclick=()=>{if(state.role==='admin')showAdmin();else if(state.role==='operator')showOperator();else openGuestAccess()};
}
const permittedImages=['assets/cerrado.svg','assets/pantanal.svg','assets/pequi.svg','assets/pantaneiro.svg','assets/congresso.svg','assets/cavalhadas.svg'];
const imageHTML=(q)=>(permittedImages.includes(q.image)||(()=>{try{return new URL(q.image).protocol==='https:'}catch{return false}})())?`<figure class="question-image"><img src="${escapeHTML(q.image)}" alt="Ilustração para a pergunta: ${escapeHTML(q.text)}" loading="eager"><figcaption>Ilustração didática • Centro-Oeste</figcaption></figure>`:'';
function svgArt(){return document.getElementById('illustration').innerHTML}
function home(){state.page='home';setNav();root.innerHTML=`<section class="home-layout" id="inicio"><div class="home-copy"><span class="top-chip">✦ &nbsp; FEIRA CULTURAL CSA 2026 <i>•</i> 7º B</span><h1>Descubra o <span class="highlight">Centro-<span class="serif">Oeste.</span></span></h1><p class="home-description">Teste seus conhecimentos sobre o <strong>Centro-Oeste</strong> em uma viagem rápida por sabores, histórias, lugares e tradições da nossa região!</p><div class="hero-actions"><button id="startBtn" class="button button-primary" type="button">Jogar agora <span aria-hidden="true">↗</span></button><span class="play-note">✦ 5 perguntas · seus tópicos<br>Rápido, divertido e gratuito</span></div><div class="home-bottom"><span>7º B — CSA</span><span class="separator"></span><span>Centro-Oeste</span><span class="separator"></span><span>2026</span></div></div><div class="home-art"><div class="art-panel"><span class="art-doodle doodle-a" aria-hidden="true">✳</span><span class="art-doodle doodle-b" aria-hidden="true">✦</span>${svgArt()}<div class="floating-stamp"><strong>5 desafios</strong><span>uma viagem de descobertas ✦</span></div></div></div></section>`;
 document.getElementById('startBtn').onclick=start;
 const visitor=getVisitor();if(visitor&&state.role!=='admin'){const button=document.createElement('button');button.type='button';button.className='button button-ghost';button.textContent='Trocar participante ('+visitor.username+')';button.onclick=()=>{clearVisitor();home()};document.querySelector('.hero-actions')?.appendChild(button)}
}
async function start(){
 if(state.role!=='admin'&&!getVisitor()){openGuestAccess(()=>start());return}
 state.page='loading';root.innerHTML='<p class="notice">Preparando as cinco perguntas…</p>';
 if(configured)try{const loaded=await loadQuizData(questions);state.bank=loaded.bank;state.topics=loaded.topics}catch(err){console.warn('Usando banco local temporariamente:',err)}
 try{state.questions=makeFlexibleSession(state.bank)}catch(error){root.innerHTML='<p class="notice warning">'+escapeHTML(error.message)+'</p>';return}
 state.answers=[];state.index=0;state.busy=false;state.page='playing';renderQuestion()
}
function renderQuestion(){
 state.page='playing';const q=state.questions[state.index];if(!q){home();return}
 const topic=state.topics.find(t=>t.id===q.topicId);const cat=topic?{icon:'✦',label:topic.title}:{icon:'✦',label:'Sem tópico'};
 root.innerHTML=`<section class="quiz-layout"><div class="quiz-topline"><span class="eyebrow">✦ EXPLORANDO O CENTRO-OESTE</span><span class="step-counter">Pergunta ${state.index+1} de 5</span></div><div class="progress" aria-label="Progresso: pergunta ${state.index+1} de 5">${Array.from({length:5},(_,i)=>`<span class="${i<state.index?'done':i===state.index?'current':''}"></span>`).join('')}</div><article class="question-card"><span class="category-label">${escapeHTML(cat.icon)} ${escapeHTML(cat.label)}</span>${imageHTML(q)}<h1 class="question-title">${escapeHTML(q.text)}</h1><div class="choices">${q.answers.map((a,i)=>`<button class="answer" type="button" data-answer="${i}"><span class="letter">${'ABCD'[i]}</span><span>${escapeHTML(a.text)}</span></button>`).join('')}</div><div class="question-hint"><span>Escolha a alternativa correta.</span><span>✳ Boa sorte!</span></div></article></section>`;
 document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>choose(+btn.dataset.answer)));
}
function choose(index){
 if(state.busy)return;const q=state.questions[state.index];const a=q?.answers[index];if(!a)return;
 state.busy=true;state.answers.push({question_id:q.id,answer_id:a.id,correct:a.correct});
 document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(+b.dataset.answer===index)b.classList.add('is-picked')});
 const next=()=>{state.index++;state.busy=false;if(state.index===5)result();else renderQuestion()};
 // Short interaction feedback, no forced timer on the questions themselves.
 window.setTimeout(next,200);
}
function result(){
 state.page='results';const score=state.answers.filter(a=>a.correct).length;
 const reviews=state.questions.map((q,i)=>{
  const item=state.answers[i],selected=q.answers.find(a=>a.id===item.answer_id),right=q.answers.find(a=>a.correct);
  return `<article class="review-item ${item.correct?'review-correct':'review-wrong'}"><div class="review-heading"><span>${item.correct?'✓ Acertou':'✕ Errou'}</span><small>${escapeHTML(state.topics.find(t=>t.id===q.topicId)?.title||'Sem tópico')}</small></div><h3>${escapeHTML(q.text)}</h3>${imageHTML(q)}<p><strong>Sua resposta:</strong> ${escapeHTML(selected?.text??'Sem resposta')}</p>${item.correct?'':`<p><strong>Resposta correta:</strong> ${escapeHTML(right?.text??'')}</p>`}<p class="explanation">${escapeHTML(q.fact||'')}</p></article>`;
 }).join('');
 root.innerHTML=`<section class="result-layout"><div class="result-card"><div class="result-emblem" aria-hidden="true">${score>=4?'🏆':score>=2?'✨':'🌸'}</div><span class="eyebrow">✦ MISSÃO CONCLUÍDA</span><h1>Resultado final</h1><div class="result-score">${score}<span> / 5</span></div><p class="result-caption">Você acertou ${score} de 5 perguntas!</p><p class="result-message">${messages[score]}</p><div class="result-actions"><button id="againBtn" class="button button-primary" type="button">Jogar novamente ↗</button><button id="homeBtn" class="button button-ghost" type="button">Página inicial</button></div><p class="saved-msg" id="savedMsg" role="status">${configured?'Registrando sua participação…':'Resultado local: não foi registrado online.'}</p></div><section class="review-panel"><div class="review-title"><span class="eyebrow">✦ CONFIRA SEUS CONHECIMENTOS</span><h2>Seu gabarito</h2><p>Veja o que acertou, o que errou e aprenda um pouco mais.</p></div><div class="review-grid">${reviews}</div></section></section>`;
 document.getElementById('againBtn').onclick=start;document.getElementById('homeBtn').onclick=home;
 const questionSnapshot=state.questions.map(q=>({id:q.id,category:q.category,topicId:q.topicId||null,text:q.text,options:q.options,correct:q.correct,fact:q.fact,image:q.image||null}));
 const attempt={score,questionIds:state.questions.map(q=>q.id),answers:state.answers.map(a=>({question_id:a.question_id,answer_id:a.answer_id,correct:a.correct})),questionSnapshot,mode:state.mode,participantId:state.mode==='fair'?getVisitor()?.id||null:null,guestToken:state.role==='admin'?null:getVisitor()?.token||null};
 if(configured)saveAttempt(attempt).then(r=>{const el=document.getElementById('savedMsg');if(el&&state.page==='results')el.textContent=r.saved?'✓ Participação registrada com sucesso.':'Pontuação não salva.'}).catch(()=>{const el=document.getElementById('savedMsg');if(el&&state.page==='results')el.textContent='Não foi possível salvar online. O resultado permanece válido.'});
}
function showLogin(){
 if(!configured){loginDialog.showModal();document.getElementById('loginStatus').textContent='O login será habilitado quando o Supabase estiver conectado. Consulte o arquivo README.md.';return}
 document.getElementById('loginStatus').textContent='';loginDialog.showModal();document.getElementById('loginEmail').focus();
}
loginForm.addEventListener('submit',async e=>{
 e.preventDefault();const submit=document.getElementById('loginSubmit'),st=document.getElementById('loginStatus');
 submit.disabled=true;st.textContent='Verificando conta...';
 try{const role=await signIn(document.getElementById('loginEmail').value.trim(),document.getElementById('loginPassword').value);if(role!=='admin'&&role!=='operator'){signOut();throw new Error('Esta conta ainda não foi autorizada pelo organizador.');}
 state.role=role;state.mode=role==='admin'?'test':'fair';state.email=document.getElementById('loginEmail').value.trim();loginDialog.close();loginForm.reset();setNav();role==='admin'?showAdmin():showOperator();
 }catch(err){st.textContent=err.message||'Não foi possível entrar.'}finally{submit.disabled=false}
});
document.getElementById('closeLogin').onclick=()=>loginDialog.close();
loginDialog.addEventListener('click',e=>{if(e.target===loginDialog)loginDialog.close()});
function showOperator(){if(state.role!=='operator')return home();state.mode='fair';state.page='operator';root.innerHTML=`<section class="result-layout"><div class="result-card"><div class="result-emblem" aria-hidden="true">🎪</div><span class="eyebrow">✦ ORGANIZAÇÃO DO EVENTO</span><h1>Modo Feira</h1><p class="result-message">O jogo está pronto para receber visitantes. Eles não precisam entrar em nenhuma conta. Os resultados serão registrados como participações da feira.</p><div class="result-actions"><button class="button button-primary" id="kioskStart">Abrir jogo <span aria-hidden="true">↗</span></button><button class="button button-ghost" id="logout">Sair da conta</button></div></div></section>`;document.getElementById('kioskStart').onclick=home;document.getElementById('logout').onclick=logout}
function logout(){signOut();state.role=null;state.email=null;state.mode='fair';home()}

function openPasswordChange(){
 const dialog=document.createElement('dialog');
 dialog.className='login-dialog';
 dialog.setAttribute('aria-labelledby','newPasswordTitle');
 dialog.innerHTML='<form id="passwordChangeForm" class="login-content"><button id="cancelPassword" class="modal-close" type="button" aria-label="Fechar">×</button>'+
 '<span class="eyebrow">✦ SEGURANÇA ADM</span><h2 id="newPasswordTitle">Trocar senha</h2>'+
 '<p>Digite a nova senha. Ela não será publicada no GitHub nem compartilhada com visitantes.</p>'+
 '<label for="passwordNew">Nova senha</label><input id="passwordNew" type="password" minlength="12" autocomplete="new-password" required>'+
 '<label for="passwordConfirm">Repita a senha</label><input id="passwordConfirm" type="password" minlength="12" autocomplete="new-password" required>'+
 '<p id="passwordStatus" role="status" class="form-status"></p>'+
 '<button id="passwordSave" type="submit" class="button button-primary full">Atualizar senha ↗</button></form>';
 document.body.appendChild(dialog);dialog.showModal();
 const close=()=>{dialog.close();dialog.remove()};
 dialog.querySelector('#cancelPassword').onclick=close;
 dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
 dialog.addEventListener('close',()=>dialog.remove());
 dialog.querySelector('form').onsubmit=async event=>{
  event.preventDefault();
  const secret=dialog.querySelector('#passwordNew').value,confirmation=dialog.querySelector('#passwordConfirm').value,st=dialog.querySelector('#passwordStatus'),button=dialog.querySelector('#passwordSave');
  if(secret!==confirmation){st.textContent='As senhas não coincidem.';return}
  button.disabled=true;st.textContent='Salvando com segurança…';
  try{await changeCurrentPassword(secret);dialog.querySelector('#passwordNew').value='';dialog.querySelector('#passwordConfirm').value='';st.textContent='✓ Senha alterada com sucesso. Use a nova senha no próximo login.'}
  catch(error){st.textContent='Erro ao alterar: '+(error.message||'Tente novamente.')}finally{button.disabled=false}
 };
}

async function showAdmin(){
 if(state.role!=='admin')return showLogin();state.page='admin';state.adminTab='results';setNav();
 root.innerHTML=`<section class="admin-layout"><div class="admin-header"><div><span class="eyebrow">✦ ACESSO RESTRITO</span><h1>Painel administrativo</h1><p>Histórico, tópicos coloridos, gabaritos e perguntas personalizadas.</p></div><div class="admin-buttons"><button class="button button-primary" id="testStart">Testar quiz ↗</button><button class="button button-ghost" id="fairStart">Ver jogo</button><button class="button button-ghost" id="refreshBtn">Atualizar dados</button><button class="button button-ghost" id="csvBtn">Exportar CSV</button><button class="button button-ghost" id="passwordBtn">Trocar senha</button><button class="button button-ghost" id="logout">Sair</button></div></div><div class="filters admin-tabs"><button class="filter active" id="resultsTab">Resultados</button><button class="filter" id="bankTab">Banco de perguntas</button><button class="filter" id="musicTab">Música ♫</button></div><div id="adminContent"><p class="notice">Carregando dados…</p></div></section>`;
 document.getElementById('testStart').onclick=()=>{state.mode='test';start()};document.getElementById('fairStart').onclick=()=>{state.mode='fair';home()};document.getElementById('logout').onclick=logout;
 document.getElementById('passwordBtn').onclick=openPasswordChange;
 document.getElementById('csvBtn').onclick=exportCSV;document.getElementById('refreshBtn').onclick=()=>refreshAdmin();
 document.getElementById('resultsTab').onclick=()=>{state.adminTab='results';renderAdminContent()};
 document.getElementById('bankTab').onclick=()=>{state.adminTab='questions';renderAdminContent()};
 document.getElementById('musicTab').onclick=()=>{state.adminTab='music';renderAdminContent()};
 await refreshAdmin();
}
async function refreshAdmin(){
 if(state.page!=='admin')return;
 try{
  const [attempts,loaded,participants]=await Promise.all([fetchAttempts(),loadQuizData(questions),fetchParticipants()]);
  state.attempts=attempts;state.bank=loaded.bank;state.topics=loaded.topics;state.participants=participants;state.bankReady=true;state.bankWarning='';renderAdminContent();
 }catch(err){state.bankWarning=err.message||'Erro ao carregar os dados.';if(state.page==='admin')document.getElementById('adminContent').innerHTML=`<div class="notice warning">${escapeHTML(state.bankWarning)}</div>`}
}
function renderAdminContent(){
 if(state.page!=='admin')return;
 document.getElementById('resultsTab').classList.toggle('active',state.adminTab==='results');document.getElementById('bankTab').classList.toggle('active',state.adminTab==='questions');
 document.getElementById('musicTab').classList.toggle('active',state.adminTab==='music');
 if(state.adminTab==='music'){renderAdminMusicPanel(document.getElementById('adminContent'));return}
 if(state.adminTab==='questions'){renderQuestionBank();return}
 const data=state.attempts.filter(a=>state.filter==='all'||a.mode===state.filter);
 const n=data.length,avg=n?(data.reduce((s,a)=>s+a.score,0)/n).toFixed(2).replace('.',','):'0,00',perfect=data.filter(a=>a.score===5).length,pct=n?Math.round(perfect/n*100):0;
 const counts=Array.from({length:6},(_,i)=>data.filter(a=>a.score===i).length);const max=Math.max(...counts,1);const size=40;const pageCount=Math.max(1,Math.ceil(n/size));state.pageNumber=Math.min(state.pageNumber,pageCount-1);
 const rows=data.slice(state.pageNumber*size,(state.pageNumber+1)*size);
 document.getElementById('adminContent').innerHTML=`<div class="stats-grid"><div class="stat-card"><small>PARTIDAS REGISTRADAS</small><strong class="pink">${n}</strong></div><div class="stat-card"><small>MÉDIA DE ACERTOS</small><strong>${avg}<span class="stats-suffix"> / 5</span></strong></div><div class="stat-card"><small>5 ACERTOS</small><strong>${perfect}</strong></div><div class="stat-card"><small>APROVEITAMENTO MÁXIMO</small><strong>${pct}%</strong></div></div><section class="admin-panel"><div class="panel-title"><h2>Distribuição dos resultados</h2><div class="filters"><button class="filter ${state.filter==='fair'?'active':''}" id="filterFair">Feira</button><button class="filter ${state.filter==='test'?'active':''}" id="filterTest">Testes</button><button class="filter ${state.filter==='all'?'active':''}" id="filterAll">Todas</button></div></div><div class="histogram">${counts.map((count,i)=>`<div class="bar-col"><strong>${count}</strong><div class="bar" style="height:${Math.max(5,Math.round(count/max*112))}px"></div><small>${i}/5</small></div>`).join('')}</div></section><section class="admin-panel"><div class="panel-title"><h2>Histórico de partidas</h2><span class="eyebrow">${n} registros • página ${state.pageNumber+1}/${pageCount}</span></div>${!n?'<p class="empty">Nenhuma partida registrada até agora.</p>':`<div class="table-wrap"><table class="attempts"><thead><tr><th>Participante</th><th>Data / hora</th><th>Pontuação</th><th>Tipo</th><th>Gabarito</th></tr></thead><tbody>${rows.map(a=>`<tr><td>${escapeHTML(state.participants.find(p=>p.id===a.participant_id)?.username||(a.mode==='test'?'ADM':'Visitante'))}</td><td>${escapeHTML(new Date(a.created_at).toLocaleString('pt-BR'))}</td><td><span class="score-pill">${a.score} / 5</span></td><td>${a.mode==='test'?'Teste':'Feira'}</td><td><button class="mini-button" data-attempt="${escapeHTML(a.id)}">Detalhes ↗</button></td></tr>`).join('')}</tbody></table></div><div class="pagination"><button id="pageBack" class="button button-ghost" ${state.pageNumber===0?'disabled':''}>Anterior</button><span>${state.pageNumber+1} de ${pageCount}</span><button id="pageNext" class="button button-ghost" ${state.pageNumber===pageCount-1?'disabled':''}>Próxima</button></div>`}</section><div id="attemptDetail"></div><p class="notice">Resultados de teste não entram nas estatísticas da feira. Use “Todas” para ver os dois tipos juntos.</p>`;
 for(const key of ['fair','test','all'])document.getElementById('filter'+key[0].toUpperCase()+key.slice(1)).onclick=()=>{state.filter=key;state.pageNumber=0;renderAdminContent()};
 document.querySelectorAll('[data-attempt]').forEach(b=>b.onclick=()=>renderAttemptDetail(b.dataset.attempt));
 if(n){document.getElementById('pageBack').onclick=()=>{state.pageNumber--;renderAdminContent()};document.getElementById('pageNext').onclick=()=>{state.pageNumber++;renderAdminContent()}}
}
function renderAttemptDetail(id){
 const a=state.attempts.find(r=>r.id===id);if(!a)return;
 const snapshot=Array.isArray(a.question_snapshot)?a.question_snapshot:[];
 const content=(a.answers||[]).map((item,i)=>{
  const q=snapshot[i]||state.bank.find(q=>q.id===item.question_id);const aNo=Number((item.answer_id||'').split('-').at(-1));
  return `<div class="attempt-answer ${item.correct?'right':'wrong'}"><span>${item.correct?'✓':'✕'} ${escapeHTML(q?.text||item.question_id)}</span><small>Sua resposta: ${escapeHTML(q?.options?.[aNo]||'?')} • Correta: ${escapeHTML(q?.options?.[q.correct]||'?')}</small></div>`
 }).join('');
 const box=document.getElementById('attemptDetail');box.innerHTML=`<section class="admin-panel"><div class="panel-title"><h2>Gabarito da partida</h2><button class="mini-button" id="closeDetail">Fechar ×</button></div><p>Registrada em ${escapeHTML(new Date(a.created_at).toLocaleString('pt-BR'))} • ${a.score}/5 • ${a.mode==='test'?'Teste':'Feira'}</p>${content||'<p>Sem respostas detalhadas disponíveis.</p>'}</section>`;document.getElementById('closeDetail').onclick=()=>box.innerHTML='';box.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderQuestionBank(){
 const content=document.getElementById('adminContent');
 renderStudio(content,{bank:state.bank,topics:state.topics,onChanged:async()=>{const updated=await loadQuizData(questions);state.bank=updated.bank;state.topics=updated.topics;if(state.page==='admin')renderQuestionBank()}});
}
function exportCSV(){
 if(!state.attempts.length){alert('Ainda não há resultados para exportar.');return}
 const data=state.attempts.map(a=>[a.created_at,a.mode,a.score,state.participants.find(p=>p.id===a.participant_id)?.username||'',state.participants.find(p=>p.id===a.participant_id)?.email||'',JSON.stringify(a.question_ids),JSON.stringify(a.answers),JSON.stringify(a.question_snapshot)]);
 const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';const csv='\uFEFF'+[['data','tipo','pontuacao','username','email','perguntas','respostas','gabarito_original'],...data].map(line=>line.map(quote).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='resultados-feira-cultural-csa-2026.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),500);
}
async function init(){initGuestUI({onAdminAccess:showLogin,onGuestChanged:home});initMusic();setNav();home();if(!configured)return;try{const loaded=await loadQuizData(questions);state.bank=loaded.bank;state.topics=loaded.topics;state.bankReady=true;}catch(err){console.warn('Sem acesso ao banco online de perguntas; usando padrão local.',err)}try{const s=activeSession();if(!s)return;const role=await getRole();if(role==='admin'||role==='operator'){state.role=role;state.mode=role==='admin'?'test':'fair';state.email=s.user?.email||null;setNav()}}catch{signOut()}}
init();
