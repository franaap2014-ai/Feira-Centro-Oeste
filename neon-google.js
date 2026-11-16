// Google OAuth via Neon Managed Better Auth. No password is stored in this file.
const AUTH_URL='https://ep-autumn-lake-b89mxi4i.neonauth.c-14.us-east-1.aws.neon.tech/neondb/auth';
const ADM_EMAIL='franaap2014@gmail.com';
let clientPromise=null;
async function client(){
 if(!clientPromise){
  clientPromise=(async()=>{
   // Pinned Neon SDK version. External dependency is loaded only for ADM setup.
   const [sdk,adapters]=await Promise.all([
    import('https://esm.sh/@neon/auth@0.8.2?bundle'),
    import('https://esm.sh/@neon/auth@0.8.2/vanilla/adapters?bundle')
   ]);
   if(typeof sdk.createAuthClient!=='function'||typeof adapters.BetterAuthVanillaAdapter!=='function')
    throw new Error('O módulo de acesso Google não carregou.');
   return sdk.createAuthClient(AUTH_URL,{
    adapter:adapters.BetterAuthVanillaAdapter({fetchOptions:{credentials:'include'}})
   });
  })().catch(error=>{clientPromise=null;throw new Error('Não foi possível iniciar o login Google. Verifique sua conexão. '+(error?.message||''))});
 }
 return clientPromise;
}
export async function startGoogleVerification(){
 const auth=await client();
 const response=await auth.signIn.social({
  provider:'google',
  callbackURL:window.location.origin+window.location.pathname+'?adm_google=1'
 });
 if(response?.error)throw new Error(response.error.message||'Falha na verificação Google.');
 if(response?.data?.url)window.location.assign(response.data.url);
}
export async function checkGoogleVerification(){
 const auth=await client();
 const response=await auth.getSession({fetchOptions:{credentials:'include'}});
 if(response?.error)throw new Error(response.error.message||'Não foi possível recuperar a sessão Google.');
 const user=response?.data?.user||response?.data?.session?.user;
 if(!user)return{status:'signed_out'};
 if(String(user.email||'').trim().toLowerCase()!==ADM_EMAIL||user.emailVerified!==true)
  return{status:'wrong_account'};
 let jwt=null;
 if(typeof auth.token==='function'){
  const tokenResponse=await auth.token();
  if(tokenResponse?.error)throw new Error(tokenResponse.error.message||'Token de verificação indisponível.');
  jwt=tokenResponse?.data?.token||null;
 }
 jwt=jwt||response?.data?.session?.token||response?.data?.session?.access_token||null;
 if(!jwt||typeof jwt!=='string')throw new Error('A sessão Google não retornou um comprovante seguro. Repita a verificação.');
 return{status:'verified',email:user.email,token:jwt};
}
