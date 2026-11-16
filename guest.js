import {createGuestAccount,loginGuestAccount,logoutGuestAccount,getGuestAccount} from './backend.js';
const STORAGE_KEY='csa-quiz-user-session-v2';
let adminAccess=()=>{},onGuestChange=()=>{};
export function getVisitor(){
 try{
  const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
  if(typeof data?.token==='string'&&/^[a-f0-9]{64}$/.test(data.token)&&
      /^[a-f0-9-]{36}$/i.test(data.id||'')&&typeof data.username==='string')return data;
 }catch{}
 return null;
}
export function clearVisitor(){
 const previous=getVisitor();
 localStorage.removeItem(STORAGE_KEY);
 if(previous?.token)logoutGuestAccount(previous.token).catch(()=>{});
}
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))}
let afterLogin=()=>{};
let mode='create';
function draw(){
 const dialog=document.getElementById('guestAccessDialog');
 const form=document.getElementById('guestAccountForm');
 const title=document.getElementById('guestAccessTitle');
 const active=getVisitor();
 const controls=document.getElementById('guestAccountFields');
 const actions=document.getElementById('guestAccountActions');
 const submit=document.getElementById('guestAccountSubmit');
 const status=document.getElementById('guestAccountStatus');
 status.textContent='';
 if(active&&mode==='account'){
  title.textContent='Minha conta';
  controls.innerHTML='<p class="guest-welcome">Você está conectado como <strong>'+escapeHTML(active.username)+'</strong>.</p>'+ '<p class="guest-persist-note">Sua conta continua conectada neste aparelho. Use “Sair da conta” para desconectar.</p>';
  submit.hidden=true;
  actions.innerHTML='<button type="button" id="guestPlay" class="button button-primary full">Jogar agora ↗</button>'+
  '<button type="button" id="guestLogout" class="guest-text-action">Sair da conta</button>'+
  '<button type="button" id="guestAdmin" class="guest-text-action guest-admin-action">Acesso de ADM</button>';
  document.getElementById('guestPlay').onclick=()=>{dialog.close();afterLogin()};
  document.getElementById('guestLogout').onclick=()=>{clearVisitor();mode='create';draw();onGuestChange()};
  document.getElementById('guestAdmin').onclick=()=>{dialog.close();adminAccess()};
  return;
 }
 const creating=mode==='create';
 title.textContent=creating?'Criar conta':'Entrar na conta';
 controls.innerHTML='<label for="guestUsername">Username</label>'+
 '<input id="guestUsername" name="username" type="text" autocomplete="username" minlength="3" maxlength="24" pattern="[a-zA-Z0-9_]{3,24}" required placeholder="Escolha seu username" />'+
 '<label for="guestPassword">Senha</label>'+
 '<input id="guestPassword" name="password" type="password" autocomplete="'+(creating?'new-password':'current-password')+'" minlength="10" maxlength="72" required placeholder="Digite sua senha" />'+
 (creating?'<label for="guestPasswordRepeat">Repetir senha</label>'+
 '<input id="guestPasswordRepeat" name="confirm" type="password" autocomplete="new-password" minlength="10" maxlength="72" required placeholder="Repita sua senha" />':'');
 submit.hidden=false;submit.textContent=creating?'Criar':'Entrar';
 actions.innerHTML='<button type="button" id="guestSwitch" class="guest-text-action">'+
 (creating?'Já tem uma conta? <strong>Entre</strong>':'Não tem conta? <strong>Criar conta</strong>')+'</button>'+
 '<button type="button" id="guestAdmin" class="guest-text-action guest-admin-action">Acesso de ADM</button>'+
 '<small>Cadastro sem e-mail. Você permanece conectado neste aparelho por até 90 dias sem atividade.</small>';
 document.getElementById('guestSwitch').onclick=()=>{mode=creating?'login':'create';draw();document.getElementById('guestUsername').focus()};
 document.getElementById('guestAdmin').onclick=()=>{dialog.close();adminAccess()};
 document.getElementById('guestUsername').focus();
}
export function openGuestAccess(callback){
 afterLogin=typeof callback==='function'?callback:onGuestChange;
 mode=getVisitor()?'account':'create';
 const dialog=document.getElementById('guestAccessDialog');
 if(!dialog.open)dialog.showModal();
 draw();
}
export function initGuestUI({onAdminAccess,onGuestChanged}={}){
 adminAccess=typeof onAdminAccess==='function'?onAdminAccess:()=>{};
 onGuestChange=typeof onGuestChanged==='function'?onGuestChanged:()=>{};
 const dialog=document.getElementById('guestAccessDialog');
 if(!dialog)return;
 document.getElementById('guestClose').onclick=()=>dialog.close();
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 document.getElementById('guestAccountForm').onsubmit=async event=>{
  event.preventDefault();
  if(mode==='account')return;
  const username=document.getElementById('guestUsername').value.trim();
  const password=document.getElementById('guestPassword').value;
  const button=document.getElementById('guestAccountSubmit'),status=document.getElementById('guestAccountStatus');
  if(mode==='create'&&password!==document.getElementById('guestPasswordRepeat').value){
   status.textContent='As senhas não coincidem.';return;
  }
  button.disabled=true;status.textContent='Aguarde…';
  try{
   const user=mode==='create'?await createGuestAccount(username,password):await loginGuestAccount(username,password);
   if(!user?.token||!user?.id||!user?.username)throw new Error('Resposta inválida do servidor.');
   localStorage.setItem(STORAGE_KEY,JSON.stringify({id:user.id,username:user.username,token:user.token}));
   document.getElementById('guestPassword').value='';
   const repeat=document.getElementById('guestPasswordRepeat');
   if(repeat)repeat.value='';
   dialog.close();
   onGuestChange();
   afterLogin();
  }catch(error){status.textContent=error?.message||'Não foi possível entrar. Confira seus dados.'}
  finally{button.disabled=false}
 };
 const previous=getVisitor();
 if(previous) getGuestAccount(previous.token).then(data=>{
  if(!data||data.id!==previous.id){localStorage.removeItem(STORAGE_KEY);onGuestChange()}
 }).catch(()=>{});
}
export function showVisitorRegistration(_container,onRegistered){openGuestAccess(onRegistered)}
