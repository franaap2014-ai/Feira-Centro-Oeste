import { CONFIG } from './config.js';
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
 try{const data=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+data.expires_in*1000,user:data.user};localStorage.setItem(AUTH_KEY,JSON.stringify(session));return session.access_token}catch{signOut();return null}
}
export function signOut(){session=null;localStorage.removeItem(AUTH_KEY)}
export async function getRole(){const token=await getValidToken();if(!token)return null;const rows=await request(`/rest/v1/quiz_roles?select=role&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,{token});return rows?.[0]?.role??null}
export async function fetchOverrides(){return await request('/rest/v1/quiz_question_overrides?select=id,category,text,options,correct,fact,image,updated_at&order=id.asc')}
export async function updateQuestion(question){
 const token=await getValidToken();if(!token||await getRole()!=='admin')throw new Error('Somente a conta ADM pode editar.');
 const payload={id:question.id,category:question.category,text:question.text,options:question.options,correct:question.correct,fact:question.fact||'',image:question.image||null,updated_at:new Date().toISOString()};
 await request('/rest/v1/quiz_question_overrides?on_conflict=id',{method:'POST',token,prefer:'resolution=merge-duplicates,return=minimal',body:payload});return true;
}
export async function saveAttempt({score,questionIds,answers,mode,questionSnapshot}){
 if(!configured)return{saved:false};
 const token=await getValidToken();
 await request('/rest/v1/quiz_attempts',{method:'POST',token,prefer:'return=minimal',body:{score,question_ids:questionIds,answers,mode,question_snapshot:questionSnapshot,created_by:token?session.user.id:null}});
 return{saved:true};
}
export async function fetchAttempts(){
 const token=await getValidToken();if(!token)throw new Error('É preciso entrar na conta ADM.');
 const result=[];const pageSize=1000;
 for(let offset=0;offset<100000;offset+=pageSize){
  const rows=await request(`/rest/v1/quiz_attempts?select=id,created_at,score,mode,question_ids,answers,question_snapshot&order=created_at.desc,id.desc&limit=${pageSize}&offset=${offset}`,{token});
  result.push(...rows);if(rows.length<pageSize)return result;
 }
 throw new Error('Limite de consulta atingido; exporte os dados em intervalos menores.');
}
