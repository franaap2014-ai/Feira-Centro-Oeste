import {categories} from './questions.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let tab='all',query='';
export function renderStudio(host,{bank}){
 const list=bank.filter(q=>(tab==='all'||q.category===tab)&&q.text.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
 const tabs='<button type="button" data-tab="all" class="topic-chip'+(tab==='all'?' active':'')+'">Todas <small>'+bank.length+'</small></button>'+
 categories.map(c=>'<button type="button" data-tab="'+esc(c.id)+'" class="topic-chip'+(tab===c.id?' active':'')+'">'+esc(c.icon)+' '+esc(c.label)+' <small>'+bank.filter(q=>q.category===c.id).length+'</small></button>').join('');
 const items=list.map(q=>'<article class="closed-question"><div class="closed-question-top"><span class="score-pill">'+esc(q.id)+'</span><span>'+esc(categories.find(c=>c.id===q.category)?.label||'')+'</span><strong>🔒 Fixa</strong></div><h3>'+esc(q.text)+'</h3><ol class="closed-answers">'+
 q.options.map((answer,i)=>'<li class="'+(i===q.correct?'correct':'')+'"><b>'+('ABCD'[i])+')</b> '+esc(answer)+(i===q.correct?' <strong>✓ Correta</strong>':'')+'</li>').join('')+'</ol></article>').join('');
 host.innerHTML='<section class="admin-panel studio-panel">'+
 '<div class="panel-title"><div><h2>Banco oficial de perguntas</h2><p class="muted">30 perguntas · 3 temas · 5 por partida</p></div><span class="score-pill">🔒 BANCO FECHADO</span></div>'+
 '<p class="notice">As 30 perguntas e seus gabaritos foram finalizados. O painel permite apenas consulta: nenhuma pergunta, alternativa ou tópico pode ser adicionado, editado ou excluído.</p>'+
 '<div class="topic-chips closed-tabs">'+tabs+'</div><label class="closed-search" for="closedSearch">Pesquisar pergunta<input id="closedSearch" type="search" placeholder="Buscar enunciado..." value="'+esc(query)+'"></label>'+
 '<div class="closed-question-grid">'+(items||'<p class="empty">Nenhuma pergunta encontrada.</p>')+'</div></section>';
 host.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{tab=button.dataset.tab;renderStudio(host,{bank})}));
 host.querySelector('#closedSearch')?.addEventListener('input',event=>{
  const cursor=event.target.selectionStart;query=event.target.value;renderStudio(host,{bank});
  const input=host.querySelector('#closedSearch');input.focus();try{input.setSelectionRange(cursor,cursor)}catch{}
 });
}
