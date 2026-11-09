import {createAccount,requestPasswordReset,finishPasswordReset} from './backend.js';
export function initAccountUI(){
 const form=document.getElementById('loginForm'),dialog=document.getElementById('loginDialog');
 if(!form||!dialog)return;
 const submit=document.getElementById('loginSubmit'),password=document.getElementById('loginPassword'),email=document.getElementById('loginEmail'),status=document.getElementById('loginStatus');
 const extra=document.createElement('div');extra.className='account-options';
 extra.innerHTML='<button type="button" id="chooseLogin">Entrar</button><button type="button" id="chooseSignup">Criar conta</button><button type="button" id="chooseRecovery">Esqueci a senha</button>';
 submit.insertAdjacentElement('afterend',extra);
 const confirmation=document.createElement('div');confirmation.id='confirmWrap';confirmation.className='signup-confirm';confirmation.hidden=true;
 confirmation.innerHTML='<label for="confirmPassword">Confirmar senha</label><input id="confirmPassword" type="password" autocomplete="new-password" minlength="10" placeholder="Repita sua senha">';
 password.insertAdjacentElement('afterend',confirmation);
 let mode='login',recoveryToken=null;
 function choose(value){
  mode=value;status.textContent='';
  const signup=value==='signup',recovery=value==='recover',change=value==='change';
  confirmation.hidden=!signup;confirmation.querySelector('input').required=signup;
  password.hidden=recovery;password.required=!recovery;
  email.hidden=change;email.required=!change;
  const emailLabel=form.querySelector('label[for="loginEmail"]'),passwordLabel=form.querySelector('label[for="loginPassword"]');
  if(emailLabel)emailLabel.hidden=change;
  if(passwordLabel){passwordLabel.hidden=recovery;passwordLabel.textContent=(signup||change)?'Nova senha':'Senha'}
  password.autocomplete=(signup||change)?'new-password':'current-password';
  document.getElementById('loginTitle').textContent=signup?'Criar minha conta':recovery?'Recuperar senha':change?'Definir nova senha':'Olá, equipe CSA!';
  submit.textContent=signup?'Criar conta ↗':recovery?'Enviar link de recuperação ↗':change?'Salvar nova senha ↗':'Entrar na minha conta ↗';
  extra.querySelectorAll('button').forEach(b=>b.classList.toggle('active',(value==='login'&&b.id==='chooseLogin')||(value==='signup'&&b.id==='chooseSignup')||(value==='recover'&&b.id==='chooseRecovery')));
 }
 extra.querySelector('#chooseLogin').onclick=()=>choose('login');
 extra.querySelector('#chooseSignup').onclick=()=>choose('signup');
 extra.querySelector('#chooseRecovery').onclick=()=>choose('recover');
 choose('login');
 form.addEventListener('submit',async event=>{
  if(mode==='login')return;
  event.preventDefault();event.stopImmediatePropagation();
  submit.disabled=true;status.textContent='Processando…';
  try{
   if(mode==='signup'){
    if(password.value.length<10||password.value!==document.getElementById('confirmPassword').value)throw new Error('Use uma senha com pelo menos 10 caracteres e repita-a corretamente.');
    await createAccount(email.value.trim(),password.value);
    form.reset();status.textContent='Cadastro solicitado! Confira seu e-mail e clique no link de confirmação. Depois volte para Entrar.';
   }else if(mode==='recover'){
    await requestPasswordReset(email.value.trim());
    status.textContent='Se esse e-mail estiver cadastrado, você receberá um link para redefinir a senha.';
   }else if(mode==='change'){
    await finishPasswordReset(recoveryToken,password.value);
    recoveryToken=null;history.replaceState(null,'',location.pathname+location.search);
    form.reset();choose('login');status.textContent='Senha atualizada. Faça login com sua nova senha.';
   }
  }catch(error){status.textContent=error.message||'Não foi possível concluir.'}
  finally{submit.disabled=false}
 },true);
 const hash=new URLSearchParams(location.hash.replace(/^#/,''));
 if(hash.get('type')==='recovery'&&hash.get('access_token')){
  recoveryToken=hash.get('access_token');choose('change');
  if(!dialog.open)dialog.showModal();
 }
}
