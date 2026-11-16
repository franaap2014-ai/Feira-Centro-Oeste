import { CONFIG } from './config.js';
import {BANK_CLOSED} from './questions.js';
const root=CONFIG.SUPABASE_URL.replace(/\/$/,'');
const key=CONFIG.SUPABASE_PUBLISHABLE_KEY;
export const configured=Boolean(root&&key);
const AUTH_KEY='csa-quiz-auth-v1';
const readStored=()=>{try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch{return null}};
let session=readStored();
const headers=(token)=>({apikey:key,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})});
async function request(path,{method='GET',body,token,prefer}={}){
 if(!configured)throw new Error('Banco não conectado.');
 const response=await fetch(root+path,{method,headers:{...headers(token),...(prefer?{Prefer:prefer}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 const raw=await response.text();let data;try{data=raw?JSON.parse(raw):null}catch{data=raw}
 if(!response.ok)throw new Error(data?.message||data?.msg||data?.error_description||data?.error||`HTTP ${response.status}`);
 return data;
}
export function activeSession(){return session}
export async function signIn(email,password){
 const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
 session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+data.expires_in*1000,user:data.user};
 localStorage.setItem(AUTH_KEY,JSON.stringify(session));return getRole();
}
export async function getValidToken(){
 if(!session)return null;
 if(Date.now()<session.expires_at-60000)return session.access_token;
 try{const data=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+data.expires_in*1000,user:data.user};localStorage.setItem(AUTH_KEY,JSON.stringify(session));return session.access_token}catch(error){if(/invalid.*refresh|refresh.*not.*found|invalid.grant|HTTP 400|HTTP 401/i.test(String(error?.message||'')))signOut();return null}
}
export function signOut(){session=null;localStorage.removeItem(AUTH_KEY)}
export async function getRole(){const token=await getValidToken();if(!token)return null;const rows=await request(`/rest/v1/quiz_roles?select=role&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,{token});return rows?.[0]?.role??null}
export async function fetchOverrides(){return await request('/rest/v1/quiz_question_overrides?select=id,category,text,options,correct,fact,image,updated_at&order=id.asc')}
export async function updateQuestion(question){throw new Error('O banco oficial está fechado: as 30 perguntas e respostas não podem ser alteradas.')}
export async function saveAttempt({score,questionIds,answers,mode,questionSnapshot,participantId,guestToken}){
 if(!configured)return{saved:false};
 if(mode==='fair'&&guestToken){
  return guestRpc('quiz_guest_save_attempt',{
   p_token:guestToken,p_score:score,p_question_ids:questionIds,
   p_answers:answers,p_question_snapshot:questionSnapshot
  });
 }
 const token=await getValidToken();
 if(!token)throw new Error('Entre na sua conta para registrar o resultado.');
 await request('/rest/v1/quiz_attempts',{method:'POST',token,prefer:'return=minimal',body:{score,question_ids:questionIds,answers,mode,question_snapshot:questionSnapshot,participant_id:participantId||null,created_by:token?session.user.id:null}});
 return{saved:true};
}
export async function fetchAttempts(){
 const token=await getValidToken();if(!token)throw new Error('É preciso entrar na conta ADM.');
 const result=[];const pageSize=1000;
 for(let offset=0;offset<100000;offset+=pageSize){
  const rows=await request(`/rest/v1/quiz_attempts?select=id,created_at,score,mode,question_ids,answers,question_snapshot,participant_id&order=created_at.desc,id.desc&limit=${pageSize}&offset=${offset}`,{token});
  result.push(...rows);if(rows.length<pageSize)return result;
 }
 throw new Error('Limite de consulta atingido; exporte os dados em intervalos menores.');
}


// Authentication uses Supabase Auth; passwords are never stored in this repository.
export async function createAccount(email,password){
 if(password.length<10)throw new Error('A senha precisa ter pelo menos 10 caracteres.');
 return request('/auth/v1/signup?redirect_to='+encodeURIComponent(window.location.origin+window.location.pathname),{method:'POST',body:{email,password}});
}
export async function requestPasswordReset(email){
 return request('/auth/v1/recover?redirect_to='+encodeURIComponent(window.location.origin+window.location.pathname),{method:'POST',body:{email}});
}
export async function finishPasswordReset(accessToken,password){
 if(password.length<10)throw new Error('A nova senha precisa ter pelo menos 10 caracteres.');
 return request('/auth/v1/user',{method:'PUT',token:accessToken,body:{password}});
}
export async function fetchMusicSettings(){
 const rows=await request('/rest/v1/quiz_music_settings?select=youtube_video_id&id=eq.true&limit=1');
 return rows?.[0]?.youtube_video_id??null;
}
export async function saveMusicSettings(videoId){
 const token=await getValidToken();
 if(!token||await getRole()!=='admin')throw new Error('Apenas a conta ADM pode mudar a música.');
 if(videoId!==null&&!/^[\w-]{11}$/.test(videoId))throw new Error('Link do YouTube inválido.');
 return request('/rest/v1/quiz_music_settings?id=eq.true',{method:'PATCH',token,prefer:'return=minimal',body:{youtube_video_id:videoId,updated_at:new Date().toISOString()}});
}
export async function resetQuestion(id){throw new Error('O banco oficial está fechado: as 30 perguntas e respostas não podem ser alteradas.')}
// Tópicos criados pela equipe e cadastro simples de participantes.
// Os e-mails dos visitantes nunca são devolvidos para o público.
export async function loadQuizData(defaultQuestions){
 // Banco fechado, fonte única. Ignora overrides, extras e alterações antigas.
 return {topics:[],bank:defaultQuestions.map(q=>({...q,options:[...q.options],topicId:null,active:true,isOriginal:true,fixed:true}))};
}
async function requireAdminToken(){
 const token=await getValidToken();
 if(!token||await getRole()!=='admin')throw new Error('Apenas o ADM pode modificar este banco.');
 return token;
}
export async function saveTopic(topic){throw new Error('O banco oficial está fechado: as 30 perguntas e respostas não podem ser alteradas.')}
export async function removeTopic(id){throw new Error('O banco oficial está fechado: as 30 perguntas e respostas não podem ser alteradas.')}
export async function saveBankQuestion(question){throw new Error('O banco oficial está fechado: as 30 perguntas e respostas não podem ser alteradas.')}
export async function removeBankQuestion(question){throw new Error('O banco oficial está fechado: as 30 perguntas e respostas não podem ser alteradas.')}
export async function registerParticipant(email,username){
 email=String(email||'').trim().toLowerCase();
 username=String(username||'').trim();
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||email.length>160)throw new Error('Informe um endereço de e-mail válido.');
 if(username.length<2||username.length>40)throw new Error('O username deve ter de 2 a 40 caracteres.');
 const id=crypto.randomUUID();
 await request('/rest/v1/quiz_participants',{method:'POST',body:{id,email,username},prefer:'return=minimal'});
 return {id,username};
}
export async function fetchParticipants(){
 const token=await requireAdminToken();
 const output=[];
 for(let offset=0;offset<100000;offset+=1000){
  const rows=await request('/rest/v1/quiz_participants?select=id,username,email,created_at&order=created_at.desc&limit=1000&offset='+offset,{token});
  output.push(...rows);
  if(rows.length<1000)return output;
 }
 throw new Error('Muitos participantes para uma única consulta.');
}


export async function changeCurrentPassword(password){
 const token=await requireAdminToken();
 if(typeof password!=='string'||password.length<12)throw new Error('A nova senha precisa de pelo menos 12 caracteres.');
 await request('/auth/v1/user',{method:'PUT',token,body:{password}});
 return true;
}


// Cadastro e login comum por username/senha, separados do Supabase Auth administrativo.
// O servidor armazena somente um hash bcrypt da senha e um hash do token de sessão.
async function guestRpc(fn,payload){
 const result=await request('/rest/v1/rpc/'+fn,{method:'POST',body:payload});
 if(result?.error)throw new Error(result.error);
 return result;
}
export async function createGuestAccount(username,password){
 return guestRpc('quiz_guest_register',{p_username:username,p_password:password});
}
export async function loginGuestAccount(username,password){
 return guestRpc('quiz_guest_login',{p_username:username,p_password:password});
}
export async function getGuestAccount(token){
 return guestRpc('quiz_guest_whoami',{p_token:token});
}
export async function logoutGuestAccount(token){
 return guestRpc('quiz_guest_logout',{p_token:token});
}


// Configuração privada, única e temporária do ADM: nenhum link de email.
export async function saveAdminSetupPassword(setupToken,password){
 if(!configured)throw new Error('O banco de dados não está conectado.');
 if(!/^[a-f0-9]{64}$/.test(setupToken||''))throw new Error('Seu link de configuração não é válido.');
 const bytes=new TextEncoder().encode(password||'').length;
 if(typeof password!=='string'||password.length<12||password.length>72||bytes>72)
  throw new Error('Use uma senha de 12 a 72 caracteres.');
 const response=await fetch(root+'/functions/v1/admin-password-setup',{
  method:'POST',
  headers:{'Content-Type':'application/json','apikey':key},
  body:JSON.stringify({token:setupToken,password})
 });
 const body=await response.json().catch(()=>null);
 if(!response.ok||body?.success!==true)throw new Error(body?.error||'Falha ao definir a senha. Solicite um novo link privado.');
 return true;
}


// Atualiza a senha da conta ADM existente, com identidade Google validada
// no servidor pela assinatura criptográfica do Neon Auth.
export async function setAdminPasswordFromGoogle(neonJwt,password){
 if(!configured)throw new Error('Banco de autenticação indisponível.');
 if(typeof neonJwt!=='string'||neonJwt.split('.').length!==3)throw new Error('Verifique sua conta Google antes de criar a senha.');
 const bytes=new TextEncoder().encode(password||'').length;
 if(typeof password!=='string'||password.length<12||password.length>72||bytes>72)
  throw new Error('A senha precisa ter de 12 a 72 caracteres.');
 const response=await fetch(root+'/functions/v1/admin-google-password',{
  method:'POST',
  headers:{
   'Content-Type':'application/json',
   'apikey':key,
   'Authorization':'Bearer '+neonJwt
  },
  body:JSON.stringify({password})
 });
 const payload=await response.json().catch(()=>null);
 if(!response.ok||payload?.success!==true)throw new Error(payload?.error||'Não foi possível salvar a senha. Tente confirmar pelo Google novamente.');
 return true;
}
