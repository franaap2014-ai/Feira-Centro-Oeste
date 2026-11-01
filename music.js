/** Trilha ambiente ORIGINAL, sintetizada localmente, sem arquivos externos ou direitos de terceiros.
 * O áudio só é iniciado após interação explícita do visitante (política dos navegadores).
 */
let context,master,loopId,voice=[];
let enabled=false;
const chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
function playChord(){
  if(!context||!enabled)return;
  const now=context.currentTime;
  const chord=chords[Math.floor((now/6)%chords.length)];
  for(const freq of chord){
    const osc=context.createOscillator(), gain=context.createGain();
    osc.type='sine';osc.frequency.value=freq/2;
    gain.gain.setValueAtTime(.0001,now);
    gain.gain.exponentialRampToValueAtTime(.026,now+1.2);
    gain.gain.setValueAtTime(.026,now+3.0);
    gain.gain.exponentialRampToValueAtTime(.0001,now+5.8);
    osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+5.9);
  }
}
export async function toggleMusic(){
  const button=document.getElementById('musicToggle');
  try {
    if(!enabled){
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext)throw new Error('Seu navegador não oferece áudio Web Audio.');
      if(!context){context=new AudioContext();master=context.createGain();master.gain.value=.44;master.connect(context.destination)}
      await context.resume();enabled=true;playChord();loopId=window.setInterval(playChord,6000);
    }else{enabled=false;clearInterval(loopId);loopId=null;await context?.suspend()}
    button?.setAttribute('aria-pressed',String(enabled));
    if(button)button.textContent=enabled?'♫ Música: ligada':'♪ Música: desligada';
  }catch(err){enabled=false;if(button)button.textContent='♪ Áudio indisponível';console.warn('Áudio indisponível:',err)}
}
export function initMusic(){const button=document.getElementById('musicToggle');if(button)button.addEventListener('click',toggleMusic)}
