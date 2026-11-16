import {saveTopic,removeTopic,saveBankQuestion,removeBankQuestion,resetQuestion} from './backend.js';
import {categories,isFixedClimateQuestion} from './questions.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const goodColor=v=>/^#[a-f0-9]{6}$/i.test(v||'')?v:'#B84D80';
const safeImage=src=>{
 if(!src)return'';
 if(/^assets\/[a-z0-9_-]+\.svg$/i.test(src))return src;
 try{const url=new URL(src);return url.protocol==='https:'?url.href:''}catch{return''}
};
let topicFilter='all',selectedId=null,creating=false,search='';
function errorStatus(message){const node=document.getElementById('studioStatus');if(node)node.textContent=message}
export function renderStudio(host,{bank,topics,onChanged}){
 const lookup=new Map(topics.map(t=>[t.id,t]));
 const visible=bank.filter(q=>(topicFilter==='all'||(topicFilter==='none'&&!q.topicId)||q.topicId===topicFilter||(topicFilter.startsWith('cat:')&&q.category===topicFilter.slice(4)))&&q.text.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
 const question=creating?{id:null,text:'',options:['','','',''],correct:0,fact:'',image:'',topicId:lookup.has(topicFilter)?topicFilter:null,isOriginal:false,active:true}:visible.find(q=>q.id===selectedId)||visible[0];
 if(question&&!creating)selectedId=question.id;
 const topicButton=(id,label,count,color)=>{
  const active=topicFilter===id?' active':'';
  return '<button type="button" data-topic="'+esc(id)+'" class="topic-chip'+active+'" style="--topic-color:'+goodColor(color)+'"><span class="topic-dot"></span>'+esc(label)+' <small>'+count+'</small></button>';
 };
 const topicTabs=topicButton('all','Todas',bank.length,'#B84D80')+
  categories.map(cat=>topicButton('cat:'+cat.id,(cat.id==='clima'?'🔒 ':'')+cat.label,cat.id==='pontos_turisticos'?10:bank.filter(q=>q.category===cat.id).length,cat.id==='clima'?'#AF3267':'#C477A1')).join('')+
  topicButton('none','Sem tópico',bank.filter(q=>!q.topicId).length,'#B3A0A9')+
  topics.map(t=>topicButton(t.id,t.title,bank.filter(q=>q.topicId===t.id).length,t.color)).join('');
 const topic=lookup.get(topicFilter);
 const pendingTourism=topicFilter==='cat:pontos_turisticos'&&bank.filter(q=>q.category==='pontos_turisticos').length===0;
 const topicManage=topic?'<form id="editTopicForm" class="topic-create"><label>Nome do tópico<input id="topicEditTitle" required maxlength="70" value="'+esc(topic.title)+'"></label><label>Cor<input id="topicEditColor" type="color" value="'+goodColor(topic.color)+'"></label><button class="mini-button" type="submit">Salvar tópico</button><button id="removeTopicBtn" class="mini-button danger" type="button">Excluir tópico</button></form>':'<p class="topic-tip">Crie um tópico e depois selecione-o na lista acima para colocar perguntas nele.</p>';
 const items=visible.map(q=>'<button type="button" class="bank-item'+(q.id===selectedId&&!creating?' active':'')+'" data-question="'+esc(q.id)+'"><strong>'+esc(q.id.slice(0,6))+'</strong><span>'+esc(q.text)+'</span>'+(q.image?' ▣':'')+'</button>').join('');
 const topicSelect='<select id="editorTopic">'+
  '<option value="">Sem tópico</option>'+topics.map(t=>'<option value="'+esc(t.id)+'"'+(question?.topicId===t.id?' selected':'')+'>'+esc(t.title)+'</option>').join('')+'</select>';
 const locked=Boolean(question?.fixed||isFixedClimateQuestion(question));
 const currentImage=safeImage(question?.image);
 const imagePreview=currentImage?'<img src="'+esc(currentImage)+'" alt="Prévia da imagem desta pergunta" loading="lazy">':'<small>Sem imagem cadastrada.</small>';
 let form=question?'<form id="studioQuestionForm" class="question-editor">'+
  '<div class="studio-form-title"><h3>'+(creating?'Nova pergunta':'Editar '+esc(question.id))+'</h3>'+(creating?'<span class="score-pill">NOVO</span>':'')+'</div>'+
  '<label for="editorTopic">Tópico desta pergunta</label>'+topicSelect+
  '<label for="editorText">Enunciado</label><textarea id="editorText" rows="3" maxlength="400" required>'+esc(question.text)+'</textarea>'+
  '<div class="editor-options">'+question.options.map((text,i)=>'<label>Alternativa '+('ABCD'[i])+'<input required data-editor-option="'+i+'" maxlength="180" value="'+esc(text)+'"></label>').join('')+'</div>'+
  '<label for="editorCorrect">Resposta correta</label><select id="editorCorrect">'+[0,1,2,3].map(i=>'<option value="'+i+'"'+(question.correct===i?' selected':'')+'>'+('ABCD'[i])+'</option>').join('')+'</select>'+
  '<label for="editorFact">Explicação do gabarito</label><textarea id="editorFact" rows="2" maxlength="600">'+esc(question.fact||'')+'</textarea>'+
  '<label for="editorImage">URL da imagem (opcional)</label><input type="text" id="editorImage" maxlength="1000" placeholder="https://exemplo.com/foto.jpg" value="'+esc(question.image||'')+'">'+
  '<p class="topic-tip">Aceita imagem HTTPS ou ilustração do site. Algumas plataformas bloqueiam exibição externa.</p>'+
  '<div id="editorImagePreview" class="studio-image-preview">'+imagePreview+'</div>'+
  '<div id="studioStatus" role="status" class="muted"></div>'+
  '<div class="editor-actions"><button class="button button-primary" id="saveQuestionBtn" type="submit">Salvar pergunta ↗</button>'+
  (creating?'<button class="button button-ghost" type="button" id="cancelNewQuestion">Cancelar</button>':
    '<button class="button button-ghost" type="button" id="removeQuestionBtn">'+(question.isOriginal?'Restaurar original':'Excluir pergunta')+'</button>')+'</div></form>':
  '<div class="empty studio-empty">Nenhuma pergunta neste tópico. Clique em “Nova pergunta” ou mova uma pergunta existente para cá.</div>';
 if(locked){
  form=form.replace('<form id="studioQuestionForm" class="question-editor">','<div id="studioQuestionForm" class="question-editor studio-locked"><div class="notice">🔒 <strong>Pergunta fixa de Clima.</strong> Enunciado, alternativas, gabarito e tópico protegidos.</div>')
   .replace(/<(textarea|input|select)\b/g,'<$1 disabled')
   .replace(/<div class="editor-actions">[\s\S]*?<\/div><\/form>$/,'</div>');
 }
 host.innerHTML='<section class="admin-panel studio-panel">'+(pendingTourism?'<div class="notice">📍 <strong>10 perguntas reservadas para Pontos Turísticos.</strong> Essas perguntas serão planejadas e aprovadas antes de entrar no quiz.</div>':'')+'<div class="panel-title"><div><h2>Banco de perguntas</h2><p class="muted">Você cria seus tópicos, escolhe a cor e organiza as perguntas como quiser.</p></div><span class="score-pill">'+bank.length+' QUESTÕES</span></div>'+
  '<form id="newTopicForm" class="topic-create"><label>Novo tópico<input required id="newTopicTitle" maxlength="70" placeholder="Ex.: Biomas"></label><label>Cor<input id="newTopicColor" type="color" value="#CB6E9B"></label><button class="button button-ghost" type="submit">+ Criar tópico</button></form>'+
  '<div class="topic-chips" aria-label="Tópicos">'+topicTabs+'</div>'+topicManage+
  '<div class="studio-toolbar"><label for="studioSearch">Buscar pergunta<input id="studioSearch" type="search" placeholder="Pesquise pelo enunciado..." value="'+esc(search)+'"></label><button type="button" class="button button-primary" id="newQuestionBtn">+ Nova pergunta</button></div>'+
  '<div class="bank-layout"><aside class="bank-items">'+(items||'<p class="empty">Nenhuma pergunta encontrada.</p>')+'</aside>'+form+'</div></section>';
 host.querySelectorAll('[data-topic]').forEach(button=>button.onclick=()=>{topicFilter=button.dataset.topic;selectedId=null;creating=false;search='';renderStudio(host,{bank,topics,onChanged})});
 host.querySelectorAll('[data-question]').forEach(button=>button.onclick=()=>{selectedId=button.dataset.question;creating=false;renderStudio(host,{bank,topics,onChanged})});
 document.getElementById('studioSearch').oninput=event=>{search=event.target.value;const cursor=event.target.selectionStart;renderStudio(host,{bank,topics,onChanged});const input=document.getElementById('studioSearch');input.focus();input.setSelectionRange(cursor,cursor)};
 document.getElementById('newQuestionBtn').onclick=()=>{creating=true;selectedId=null;renderStudio(host,{bank,topics,onChanged})};
 document.getElementById('newTopicForm').onsubmit=async event=>{
  event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;
  try{topicFilter=await saveTopic({title:document.getElementById('newTopicTitle').value,color:document.getElementById('newTopicColor').value});selectedId=null;creating=false;search='';await onChanged()}catch(error){alert('Não foi possível criar o tópico: '+error.message);button.disabled=false}
 };
 if(topic){
  document.getElementById('editTopicForm').onsubmit=async event=>{
   event.preventDefault();try{await saveTopic({id:topic.id,title:document.getElementById('topicEditTitle').value,color:document.getElementById('topicEditColor').value});await onChanged()}catch(error){alert('Não foi possível salvar: '+error.message)}
  };
  document.getElementById('removeTopicBtn').onclick=async()=>{
   if(!confirm('Excluir este tópico? As perguntas passarão para “Sem tópico”, sem serem apagadas.'))return;
   try{await removeTopic(topic.id);topicFilter='none';selectedId=null;await onChanged()}catch(error){alert('Não foi possível excluir o tópico: '+error.message)}
  };
 }
 if(!question)return;
 if(locked)return;
 if(creating)document.getElementById('cancelNewQuestion').onclick=()=>{creating=false;renderStudio(host,{bank,topics,onChanged})};
 document.getElementById('editorImage').oninput=event=>{
  const src=safeImage(event.target.value.trim());
  document.getElementById('editorImagePreview').innerHTML=src?'<img src="'+esc(src)+'" alt="Prévia da imagem" loading="lazy">':'<small>Sem prévia — use um endereço HTTPS válido.</small>';
 };
 document.getElementById('studioQuestionForm').onsubmit=async event=>{
  event.preventDefault();
  const button=document.getElementById('saveQuestionBtn');button.disabled=true;errorStatus('Salvando...');
  const image=document.getElementById('editorImage').value.trim();
  if(image&&!safeImage(image)){errorStatus('A imagem precisa usar HTTPS ou uma ilustração existente do site.');button.disabled=false;return}
  const options=[...document.querySelectorAll('[data-editor-option]')].map(field=>field.value.trim());
  const q={...question,id:question.id||('Q'+crypto.randomUUID()),text:document.getElementById('editorText').value.trim(),options,correct:+document.getElementById('editorCorrect').value,fact:document.getElementById('editorFact').value.trim(),image:image||null,topicId:document.getElementById('editorTopic').value||null,isOriginal:question.isOriginal===true};
  if(q.text.length<8||options.some(a=>a.length<2)||new Set(options.map(a=>a.toLocaleLowerCase('pt-BR'))).size!==4){errorStatus('Use um enunciado completo e quatro alternativas distintas.');button.disabled=false;return}
  try{await saveBankQuestion(q);creating=false;selectedId=q.id;topicFilter=q.topicId||'none';search='';await onChanged()}
  catch(error){errorStatus('Erro ao salvar: '+error.message);button.disabled=false}
 };
 if(!creating)document.getElementById('removeQuestionBtn').onclick=async()=>{
  const label=question.isOriginal?'Restaurar o conteúdo original desta pergunta?':'Excluir definitivamente esta pergunta personalizada?';
  if(!confirm(label))return;
  try{if(question.isOriginal)await resetQuestion(question.id);else await removeBankQuestion(question);
   selectedId=null;creating=false;await onChanged()
  }catch(error){errorStatus('Erro: '+error.message)}
 };
}
