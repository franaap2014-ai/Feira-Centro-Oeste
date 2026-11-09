import {fetchMusicSettings,saveMusicSettings} from './backend.js';
import {parseYouTubeId,setYouTubeVideoId} from './music.js';
export async function renderAdminMusicPanel(root){
 root.innerHTML='<section class="admin-panel"><div class="panel-title"><div><h2>♫ Música do estande</h2><p class="muted">Altere o vídeo do YouTube sem editar o código. Só o ADM pode salvar.</p></div></div>'+
 '<form id="adminMusicForm" class="question-editor">'+
 '<label for="adminYouTubeUrl">Link de um vídeo do YouTube</label>'+
 '<input type="url" id="adminYouTubeUrl" autocomplete="off" placeholder="https://www.youtube.com/watch?v=..." />'+
 '<p class="notice">Cole o link e clique em salvar. No estande, o botão ♫ abre o player. O vídeo fica visível enquanto toca; fechar o menu pausa a reprodução. A música ambiente original pode tocar recolhida.</p>'+
 '<div class="editor-actions"><button class="button button-primary" type="submit">Salvar música ↗</button><button id="clearMusic" type="button" class="button button-ghost">Remover vídeo</button><span id="adminMusicStatus" role="status"></span></div></form></section>';
 const input=document.getElementById('adminYouTubeUrl'),message=document.getElementById('adminMusicStatus'),form=document.getElementById('adminMusicForm');
 try{
  const current=await fetchMusicSettings();
  if(!form.isConnected)return;
  if(current)input.value='https://www.youtube.com/watch?v='+current;
 }catch(error){if(form.isConnected)message.textContent='Não foi possível consultar a configuração: '+error.message}
 form.onsubmit=async event=>{
  event.preventDefault();const id=parseYouTubeId(input.value);
  if(!id){message.textContent='Cole um link válido (youtube.com/watch ou youtu.be).';return}
  message.textContent='Salvando…';form.querySelector('[type="submit"]').disabled=true;
  try{await saveMusicSettings(id);setYouTubeVideoId(id);message.textContent='✓ Link salvo! Já vale para quem abrir a página.'}
  catch(error){message.textContent='Erro: '+error.message}
  finally{form.querySelector('[type="submit"]').disabled=false}
 };
 document.getElementById('clearMusic').onclick=async()=>{
  message.textContent='Removendo…';
  try{await saveMusicSettings(null);setYouTubeVideoId(null);input.value='';message.textContent='✓ Vídeo removido. O som ambiente continua disponível.'}
  catch(error){message.textContent='Erro: '+error.message}
 };
}
