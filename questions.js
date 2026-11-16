// Banco de 30 perguntas: 6 por tema. O jogo sorteia 5 perguntas por partida.
export const categories = [
  {id:'geografia', label:'Geografia', icon:'🗺️', subtitle:'Território e natureza'},
  {id:'culinaria', label:'Culinária', icon:'🍲', subtitle:'Sabores da região'},
  {id:'costumes', label:'Costumes', icon:'🎶', subtitle:'Tradições e cultura'},
  {id:'vestimentas', label:'Vestimentas', icon:'👒', subtitle:'Trajes e tradições'},
  {id:'pantanal', label:'Pantanal', icon:'🌿', subtitle:'Vida nas áreas alagadas'},
];
// Each correct value is the index in the original options, not a displayed button position.
export const questions = [
  {id:'G01',category:'geografia',text:'Quais estados fazem parte da Região Centro-Oeste?',options:['Goiás, Mato Grosso e Mato Grosso do Sul','Paraná, Goiás e Bahia','São Paulo, Goiás e Pará','Mato Grosso, Tocantins e Minas Gerais'],correct:0,fact:'Além desses três estados, a região inclui o Distrito Federal.'},
  {id:'G02',category:'geografia',text:'Qual é a capital de Mato Grosso?',options:['Goiânia','Campo Grande','Cuiabá','Palmas'],correct:2,fact:'Cuiabá é a capital do estado de Mato Grosso.'},
  {id:'G03',category:'geografia',text:'Qual é a capital de Mato Grosso do Sul?',options:['Cuiabá','Campo Grande','Goiânia','Corumbá'],correct:1,fact:'Campo Grande é a capital de Mato Grosso do Sul.'},
  {id:'G04',category:'geografia',text:'Qual é a capital de Goiás?',options:['Anápolis','Goiânia','Brasília','Rio Verde'],correct:1,fact:'Goiânia é a capital de Goiás; Brasília é a capital do Brasil.'},
  {id:'G05',category:'geografia',image:'assets/pantanal.svg',text:'O Pantanal brasileiro ocupa principalmente áreas de quais estados?',options:['Goiás e Tocantins','Goiás e Mato Grosso','Mato Grosso e Mato Grosso do Sul','Minas Gerais e Bahia'],correct:2,fact:'O Pantanal está presente sobretudo em Mato Grosso e Mato Grosso do Sul.'},
  {id:'G06',category:'geografia',image:'assets/cerrado.svg',text:'Observe a ilustração: qual bioma do Centro-Oeste está representado?',options:['Mata Atlântica','Cerrado','Caatinga','Pampa'],correct:1,fact:'O Cerrado ocupa grande parte do Centro-Oeste brasileiro.'},

  {id:'C01',category:'culinaria',image:'assets/pequi.svg',text:'Qual fruto do Cerrado é muito usado no arroz típico de Goiás?',options:['Pequi','Maçã','Morango','Pêssego'],correct:0,fact:'O pequi é um fruto típico do Cerrado, presente em preparações regionais.'},
  {id:'C02',category:'culinaria',text:'O empadão goiano é um prato tradicional de qual estado?',options:['Mato Grosso','Goiás','Acre','Rio Grande do Sul'],correct:1,fact:'O empadão goiano é uma preparação tradicional de Goiás.'},
  {id:'C04',category:'culinaria',text:'A chipa, popular em Mato Grosso do Sul, é geralmente preparada com...',options:['Polvilho e queijo','Macarrão e tomate','Peixe cru','Batata e chocolate'],correct:0,fact:'A chipa tem tradição na região de fronteira e costuma levar polvilho e queijo.'},
  {id:'C05',category:'culinaria',text:'Apesar do nome, a “sopa paraguaia” tradicional é...',options:['Uma bebida gelada','Um caldo servido em tigela','Um prato assado à base de milho','Uma sobremesa de frutas'],correct:2,fact:'A sopa paraguaia é um prato salgado assado bastante conhecido em Mato Grosso do Sul.'},
  {id:'C06',category:'culinaria',text:'A mojica de pintado é preparada principalmente com qual alimento?',options:['Peixe','Carne de porco','Banana','Frango'],correct:0,fact:'O pintado é um peixe utilizado em receitas tradicionais, inclusive em Mato Grosso.'},
  {id:'C07',category:'culinaria',text:'Qual bebida com erva-mate e água fria é muito popular em Mato Grosso do Sul?',options:['Chocolate quente','Tereré','Café com leite','Suco de caju'],correct:1,fact:'O tereré é tradicionalmente preparado com erva-mate e água fria.'},

  {id:'T01',category:'costumes',text:'A catira é uma manifestação cultural marcada principalmente por...',options:['Sapateado e palmas','Dança com leques','Roda de capoeira','Música instrumental sem dança'],correct:0,fact:'A catira usa movimentos dos pés e palmas, frequentemente ao som da viola.'},
  {id:'T02',category:'costumes',text:'Qual instrumento é muito associado à música caipira e à catira?',options:['Harpa celta','Viola caipira','Gaita de foles','Saxofone'],correct:1,fact:'A viola caipira acompanha muitas manifestações musicais da região.'},
  {id:'T03',category:'costumes',image:'assets/cavalhadas.svg',text:'As Cavalhadas de Pirenópolis são uma tradição cultural de qual estado?',options:['Goiás','Mato Grosso do Sul','Mato Grosso','Distrito Federal'],correct:0,fact:'As Cavalhadas de Pirenópolis são uma celebração tradicional em Goiás.'},
  {id:'T04',category:'costumes',text:'Compartilhar uma roda de tereré é um costume muito presente em...',options:['Mato Grosso do Sul','Pará','Maranhão','Pernambuco'],correct:0,fact:'O tereré integra o convívio social em Mato Grosso do Sul.'},
  {id:'T05',category:'costumes',text:'O siriri é conhecido como uma expressão tradicional de...',options:['Dança e música','Arquitetura moderna','Escalada esportiva','Cinema mudo'],correct:0,fact:'O siriri é uma manifestação de dança e música popular em Mato Grosso.'},
  {id:'T06',category:'costumes',text:'O cururu, presente em tradições de Mato Grosso, está relacionado a...',options:['Canto e música popular','Corrida de automóveis','Mergulho no mar','Pintura digital'],correct:0,fact:'O cururu é uma manifestação musical tradicional, com cantoria.'},

  {id:'V01',category:'vestimentas',image:'assets/pantaneiro.svg',text:'Qual acessório ajuda a proteger do sol os trabalhadores rurais do Pantanal?',options:['Chapéu de abas largas','Chapéu de festa junina de palha fina','Boné de ciclista','Capuz de tecido leve'],correct:0,fact:'Chapéus de abas largas são úteis no trabalho ao ar livre no Pantanal.'},
  {id:'V02',category:'vestimentas',text:'Em atividades rurais pantaneiras, as botas são usadas principalmente para...',options:['Proteger os pés','Ajudar na navegação','Identificar a região de origem','Substituir as esporas'],correct:0,fact:'As botas oferecem proteção aos pés durante as atividades no campo.'},
  {id:'V03',category:'vestimentas',text:'Por que calças compridas são comuns no trabalho a cavalo?',options:['Ajudam a proteger as pernas','São exclusivas para festas','Impedem o uso de botas','Servem para identificar a cidade'],correct:0,fact:'Calças compridas podem ajudar na proteção das pernas durante cavalgadas.'},
  {id:'V04',category:'vestimentas',text:'Nas Cavalhadas de Pirenópolis, os participantes a cavalo usam...',options:['Trajes elaborados que representam cavaleiros','Trajes típicos de dança de salão','Roupas de pescadores','Uniformes de bandas marciais'],correct:0,fact:'As Cavalhadas apresentam cavaleiros com trajes cerimoniais e ornamentados.'},
  {id:'V05',category:'vestimentas',text:'Nas quadrilhas de festas juninas da região, é comum ver...',options:['Vestidos rodados e trajes caipiras','Trajes de capoeira','Uniformes de futebol','Roupas de formatura'],correct:0,fact:'As quadrilhas juninas usam figurinos festivos de inspiração caipira em várias regiões.'},
  {id:'V06',category:'vestimentas',text:'Em apresentações tradicionais de siriri, um elemento frequente do figurino feminino é...',options:['Saia rodada e colorida','Saia de couro rígido','Uniforme escolar','Vestimenta de trabalho industrial'],correct:0,fact:'O figurino do siriri frequentemente usa saias rodadas e cores vivas.'},

  {id:'P01',category:'pantanal',image:'assets/pantanal.svg',text:'Qual característica natural torna o Pantanal tão especial?',options:['É um deserto sem rios','Possui planícies que alagam em parte do ano','É coberto por neve no inverno','É formado apenas por montanhas altas'],correct:1,fact:'O Pantanal é uma extensa planície com ciclos naturais de cheia e seca.'},
  {id:'P02',category:'pantanal',text:'Qual felino é encontrado no Pantanal e é importante para o equilíbrio da fauna?',options:['Onça-pintada','Leopardo-das-neves','Tigre-de-bengala','Leão-africano'],correct:0,fact:'A onça-pintada é um grande predador nativo do Pantanal e ajuda a manter o equilíbrio ecológico.'},
  {id:'P03',category:'pantanal',text:'Qual dessas aves pode ser encontrada no Pantanal e se destaca pela plumagem azul?',options:['Pinguim-imperador','Arara-azul','Avestruz','Gaivota-ártica'],correct:1,fact:'A arara-azul-grande é uma ave marcante da fauna pantaneira.'},
  {id:'P04',category:'pantanal',text:'Qual rio é fundamental para o sistema de águas do Pantanal?',options:['Rio Tietê','Rio São Francisco','Rio Paraguai','Rio Doce'],correct:2,fact:'O rio Paraguai e seus afluentes são essenciais para o ciclo de cheias da planície pantaneira.'},
  {id:'P05',category:'pantanal',text:'Por que áreas do Pantanal ficam inundadas durante parte do ano?',options:['Por causa das marés do Oceano Atlântico','Pelo aumento das águas na época das chuvas','Porque o solo é formado por gelo','Porque a região não possui árvores'],correct:1,fact:'As chuvas e os rios elevam o nível da água e provocam inundações sazonais.'},
  {id:'P06',category:'pantanal',text:'Por que é importante proteger o Pantanal?',options:['Para eliminar todas as plantas da região','Para transformar as áreas alagadas em deserto','Para preservar sua biodiversidade e os recursos hídricos','Para impedir a existência de rios'],correct:2,fact:'A conservação do Pantanal protege espécies, habitats e as águas fundamentais para a região.'},
];

export function validateBank(bank = questions) {
  if (bank.length !== 30) throw new Error('Banco deve ter exatamente 30 questões');
  const ids = new Set();
  for (const cat of categories) if (bank.filter(q => q.category === cat.id).length !== 6) throw new Error(`Categoria ${cat.id} deve ter 6 perguntas`);
  for (const q of bank) {
    if (ids.has(q.id)) throw new Error(`ID duplicado: ${q.id}`);
    ids.add(q.id);
    if (!Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3 || !q.text?.trim()) throw new Error(`Pergunta inválida: ${q.id}`);
    if (new Set(q.options).size !== 4) throw new Error(`Opções repetidas em ${q.id}`);
  }
  return true;
}
export function shuffle(input, rng = Math.random) {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function makeSession(bank = questions, rng = Math.random) {
  const chosen = categories.map(cat => {
    const group = bank.filter(q => q.category === cat.id);
    if (!group.length) throw new Error(`Sem perguntas em ${cat.id}`);
    const q = group[Math.floor(rng() * group.length)];
    return {...q, answers: shuffle(q.options.map((text, original) => ({id:`${q.id}-${original}`,text,correct:original === q.correct})),rng)};
  });
  return shuffle(chosen,rng);
}
validateBank();


// O editor permite tópicos livres; o jogo continua sorteando cinco
// perguntas diferentes. Tenta incluir tópicos diferentes primeiro.
export function makeFlexibleSession(bank,rng=Math.random){
 const eligible=bank.filter(q=>q.active!==false&&q.options?.length===4&&q.text?.trim());
 if(eligible.length<5)throw new Error('O banco precisa de pelo menos cinco perguntas ativas.');
 const groups=new Map();
 for(const q of eligible){
  const key=q.topicId||q.category||'sem-topico';
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(q);
 }
 const selected=[];
 for(const group of shuffle([...groups.values()],rng)){
  if(selected.length===5)break;
  selected.push(group[Math.floor(rng()*group.length)]);
 }
 const selectedIds=new Set(selected.map(q=>q.id));
 for(const q of shuffle(eligible.filter(q=>!selectedIds.has(q.id)),rng)){
  if(selected.length===5)break;
  selected.push(q);
 }
 return shuffle(selected.map(q=>({
  ...q,
  answers:shuffle(q.options.map((text,original)=>({id:q.id+'-'+original,text,correct:original===q.correct})),rng)
 })),rng);
}
