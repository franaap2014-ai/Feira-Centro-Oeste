import {registerParticipant} from './backend.js';
const STORAGE_KEY='csa-feira-visitor-2026-v1';
export function getVisitor(){
 try{
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
  if(saved&&/^[0-9a-f-]{36}$/i.test(saved.id)&&typeof saved.username==='string')return saved;
 }catch{}
 return null;
}
export function clearVisitor(){localStorage.removeItem(STORAGE_KEY)}
export function showVisitorRegistration(container,onRegistered){
 container.innerHTML='<section class="visitor-area"><div class="visitor-card">'+
  '<span class="eyebrow">✦ CADASTRO RÁPIDO</span><h1>Antes de começar...</h1>'+
  '<p>Escolha seu username e informe um e-mail para identificar sua participação. Sem senha e sem confirmação por e-mail.</p>'+
  '<form id="visitorForm" class="question-editor">'+
   '<label for="visitorUsername">Seu username</label><input id="visitorUsername" name="username" minlength="2" maxlength="40" required autocomplete="nickname" placeholder="Ex.: Explorador do Cerrado">'+
   '<label for="visitorEmail">Seu e-mail</label><input id="visitorEmail" name="email" type="email" maxlength="160" required autocomplete="email" placeholder="seu@email.com">'+
   '<p class="notice">Seu e-mail ficará visível somente para a organização da feira. Como não há verificação, este registro não comprova que você é dono desse e-mail.</p>'+
   '<div role="status" id="visitorStatus" class="muted"></div>'+
   '<button class="button button-primary" id="visitorSubmit" type="submit">Cadastrar e jogar ↗</button>'+
   '<button class="button button-ghost" type="button" id="visitorCancel">Voltar</button>'+
  '</form></div></section>';
 document.getElementById('visitorCancel').onclick=()=>location.reload();
 document.getElementById('visitorForm').onsubmit=async event=>{
  event.preventDefault();
  const status=document.getElementById('visitorStatus'),btn=document.getElementById('visitorSubmit');
  btn.disabled=true;status.textContent='Cadastrando…';
  try{
   const visitor=await registerParticipant(document.getElementById('visitorEmail').value,document.getElementById('visitorUsername').value);
   localStorage.setItem(STORAGE_KEY,JSON.stringify(visitor));
   await onRegistered();
  }catch(error){status.textContent='Não foi possível cadastrar: '+(error.message||'Verifique sua conexão.');btn.disabled=false}
 };
}
