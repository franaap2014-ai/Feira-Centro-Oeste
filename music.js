import {fetchMusicSettings} from './backend.js';
const ST={youtubeId:null,player:null,apiPromise:null,ambientOn:false,context:null,master:null,timer:null};
const chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
export function parseYouTubeId(input){
 try{
  const url=new URL(String(input).trim());
  if(url.protocol!=='https:'&&url.protocol!=='http:')return null;
  const host=url.hostname.toLowerCase();
  const yt=host==='youtube.com'||host==='www.youtube.com'||host==='m.youtube.com'||host==='music.youtube.com'||host==='youtube-nocookie.com'||host==='www.youtube-nocookie.com';
  let id=null;
  if(host==='youtu.be'||host==='www.youtu.be')id=url.pathname.split('/')[1];
  else if(yt){
   if(url.pathname==='/watch')id=url.searchParams.get('v');
   else if(/^\/(shorts|embed|live)\//.test(url.pathname))id=url.pathname.split('/')[2];
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:null;
 }catch{return null}
}
const el=id=>document.getElementById(id);
function status(message){const node=el('musicStatus');if(node)node.textContent=message}
function updateControls(){
 const start=el('youtubeStart'),clear=el('youtubePause'),link=el('youtubeLink'),desc=el('youtubeDescription');
 if(start)start.disabled=!ST.youtubeId;
 if(clear)clear.disabled=!ST.player;
 if(desc)desc.textContent=ST.youtubeId?'Música selecionada pela equipe • player oficial do YouTube':'Nenhum link do YouTube cadastrado. O ADM pode adicioná-lo.';
 if(link){link.hidden=!ST.youtubeId;link.href=ST.youtubeId?'https://www.youtube.com/watch?v='+ST.youtubeId:'#'}
 const ambient=el('ambientToggle');
 if(ambient){ambient.textContent=ST.ambientOn?'❚❚ Pausar som ambiente':'▶ Música ambiente suave';ambient.setAttribute('aria-pressed',String(ST.ambientOn))}
}
function playChord(){
 if(!ST.context||!ST.ambientOn)return;
 const now=ST.context.currentTime,chord=chords[Math.floor(now/6)%chords.length];
 for(const frequency of chord){
  const oscillator=ST.context.createOscillator(),gain=ST.context.createGain();
  oscillator.type='sine';oscillator.frequency.value=frequency/2;
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(.026,now+1.2);
  gain.gain.setValueAtTime(.026,now+3);
  gain.gain.exponentialRampToValueAtTime(.0001,now+5.8);
  oscillator.connect(gain);gain.connect(ST.master);oscillator.start(now);oscillator.stop(now+5.9);
 }
}
async function pauseAmbient(){
 if(!ST.ambientOn)return;
 ST.ambientOn=false;clearInterval(ST.timer);ST.timer=null;
 await ST.context?.suspend();updateControls();
}
async function toggleAmbient(){
 if(ST.ambientOn){await pauseAmbient();status('Som ambiente pausado.');return}
 try{
  pauseYouTube();
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)throw new Error('Áudio não disponível neste navegador.');
  if(!ST.context){ST.context=new Audio();ST.master=ST.context.createGain();ST.master.gain.value=.44;ST.master.connect(ST.context.destination)}
  await ST.context.resume();ST.ambientOn=true;playChord();ST.timer=setInterval(playChord,6000);updateControls();
  status('Som ambiente ligado.');
  closeMenu(false);
 }catch(error){status('Não foi possível tocar o som ambiente.');console.warn(error)}
}
function pauseYouTube(){
 if(!ST.player)return;
 try{ST.player.pauseVideo()}catch{}
 updateControls();
}
function closeMenu(pauseYT=true){
 const panel=el('musicPanel'),btn=el('musicToggle');
 if(pauseYT)pauseYouTube();
 if(panel)panel.hidden=true;
 if(btn)btn.setAttribute('aria-expanded','false');
}
function loadAPI(){
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(ST.apiPromise)return ST.apiPromise;
 ST.apiPromise=new Promise((resolve,reject)=>{
  const old=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{if(typeof old==='function')old();resolve(window.YT)};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  script.onerror=()=>reject(new Error('API do YouTube indisponível.'));
  document.head.appendChild(script);
 });
 return ST.apiPromise;
}
async function startYouTube(){
 if(!ST.youtubeId)return status('O ADM ainda não definiu uma música do YouTube.');
 const panel=el('musicPanel'),holder=el('youtubeSlot');
 if(!panel||!holder)return;
 await pauseAmbient();
 holder.hidden=false;status('Carregando o player do YouTube…');
 try{
  const api=await loadAPI();
  if(panel.hidden)return;
  if(!ST.player){
   holder.innerHTML='<div id="youtubeFrame"></div>';
   ST.player=new api.Player('youtubeFrame',{
    width:'320',height:'220',videoId:ST.youtubeId,
    playerVars:{autoplay:0,controls:1,playsinline:1,rel:0,origin:window.location.origin},
    events:{
     onReady:event=>{updateControls();if(!panel.hidden){event.target.playVideo();status('Se o navegador bloquear a reprodução, toque em ▶ dentro do vídeo.')}} ,
     onStateChange:event=>{if(event.data===1)status('Reproduzindo do YouTube.');if(event.data===2)status('Vídeo pausado.')},
     onAutoplayBlocked:()=>status('Clique em ▶ diretamente no vídeo para iniciar.')
    }
   });
  }else{
   ST.player.loadVideoById(ST.youtubeId);
   status('Iniciando…');
  }
  updateControls();
 }catch(error){status('Não foi possível abrir o player. Use o link para assistir no YouTube.');console.warn(error)}
}
export function setYouTubeVideoId(videoId){
 const next=/^[A-Za-z0-9_-]{11}$/.test(videoId||'')?videoId:null;
 if(ST.youtubeId!==next){
  try{ST.player?.destroy()}catch{}
  ST.player=null;
  const slot=el('youtubeSlot');if(slot){slot.hidden=true;slot.innerHTML='<div id="youtubeFrame"></div>'}
 }
 ST.youtubeId=next;updateControls();
}
export function initMusic(){
 const original=el('musicToggle');if(!original)return;
 const wrap=document.createElement('div');wrap.className='music-wrap';
 original.parentNode.insertBefore(wrap,original);wrap.appendChild(original);
 original.textContent='♫';
 original.classList.add('music-icon');original.setAttribute('aria-expanded','false');
 original.setAttribute('aria-controls','musicPanel');original.removeAttribute('aria-pressed');
 original.setAttribute('aria-label','Abrir opções de música');original.title='Opções de música';
 wrap.insertAdjacentHTML('beforeend',
  '<section id="musicPanel" class="music-panel" aria-label="Controle de música" hidden>'+
   '<div class="music-panel-header"><strong>♫ Música do estande</strong><button id="musicClose" type="button" class="mini-button" aria-label="Fechar controles">Fechar ×</button></div>'+
   '<p class="music-muted">O som só começa quando alguém escolhe reproduzir.</p>'+
   '<button id="ambientToggle" class="button button-ghost full" type="button">▶ Música ambiente suave</button>'+
   '<div class="music-divider"></div><p id="youtubeDescription" class="music-muted"></p>'+
   '<div class="music-video-actions"><button id="youtubeStart" type="button" class="mini-button">▶ Play YouTube</button><button id="youtubePause" type="button" class="mini-button">❚❚ Pausar</button></div>'+
   '<div id="youtubeSlot" class="youtube-slot" hidden><div id="youtubeFrame"></div></div>'+
   '<a id="youtubeLink" class="music-external" target="_blank" rel="noopener noreferrer" href="#" hidden>Abrir no YouTube ↗</a>'+
   '<p id="musicStatus" class="music-muted" role="status"></p>'+
  '</section>');
 original.onclick=()=>{const panel=el('musicPanel');const wasOpen=!panel.hidden;if(wasOpen)closeMenu();else{panel.hidden=false;original.setAttribute('aria-expanded','true')}};
 el('musicClose').onclick=()=>closeMenu();
 el('ambientToggle').onclick=toggleAmbient;
 el('youtubeStart').onclick=startYouTube;
 el('youtubePause').onclick=()=>{pauseYouTube();status('Vídeo pausado.')};
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
 document.addEventListener('pointerdown',event=>{if(!wrap.contains(event.target)&&!el('musicPanel').hidden)closeMenu()});
 updateControls();
 fetchMusicSettings().then(setYouTubeVideoId).catch(()=>status('Sem conexão ao banco de música. O som ambiente continua disponível.'));
}
