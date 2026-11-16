// 30 questões-base: 10 de Clima imutáveis e 20 dos outros cinco temas.
export const categories = [
 {id:"clima",label:"Clima",icon:"🌦️",subtitle:"Clima e biomas"},
 {id:"geografia",label:"Geografia",icon:"🗺️",subtitle:"Estados e capitais"},
 {id:"culinaria",label:"Culinária",icon:"🍲",subtitle:"Sabores regionais"},
 {id:"costumes",label:"Costumes",icon:"🎶",subtitle:"Festas e tradições"},
 {id:"vestimentas",label:"Vestimentas",icon:"👒",subtitle:"Roupas típicas"},
 {id:"pantanal",label:"Pantanal",icon:"🌿",subtitle:"Fauna e paisagens"},
];
export const isFixedClimateQuestion = value => /^CL(?:0[1-9]|10)$/.test(typeof value==='string'?value:String(value?.id||''));
export const questions = [
 {id:'CL01',category:'clima',text:"Qual é o clima predominante na região Centro-Oeste?",options:["Equatorial","Tropical","Subtropical","Semiárido"],correct:1,fact:'',fixed:true},
 {id:'CL02',category:'clima',text:"Como são as estações do ano no Centro-Oeste?",options:["Verão seco e inverno chuvoso","Frio o ano inteiro","Verão chuvoso e inverno seco","Chuva durante todo o ano"],correct:2,fact:'',fixed:true},
 {id:'CL03',category:'clima',text:"Qual é o principal bioma da região Centro-Oeste?",options:["Amazônia","Caatinga","Pampa","Cerrado"],correct:3,fact:'',fixed:true},
 {id:'CL04',category:'clima',text:"Qual característica é comum na vegetação do Cerrado?",options:["Árvores baixas, troncos retorcidos e gramíneas","Árvores muito altas e folhas largas","Vegetação formada apenas por cactos","Florestas cobertas de neve"],correct:0,fact:'',fixed:true},
 {id:'CL05',category:'clima',text:"Qual bioma brasileiro é conhecido por suas áreas alagadas?",options:["Mata Atlântica","Pantanal","Caatinga","Pampa"],correct:1,fact:'',fixed:true},
 {id:'CL06',category:'clima',text:"Qual é uma característica do clima do Pantanal?",options:["Temperaturas muito baixas","Pouca variação de temperatura","Períodos de cheia e seca","Neve durante o inverno"],correct:2,fact:'',fixed:true},
 {id:'CL07',category:'clima',text:"Qual bioma também está presente na região Centro-Oeste, principalmente em Mato Grosso?",options:["Amazônia","Pampa","Caatinga","Mata de Araucárias"],correct:0,fact:'',fixed:true},
 {id:'CL08',category:'clima',text:"Por que muitas plantas do Cerrado possuem raízes profundas?",options:["Para alcançar água em camadas profundas do solo","Para sobreviver à neve","Para evitar o contato com o sol","Para viver dentro da água"],correct:0,fact:'',fixed:true},
 {id:'CL09',category:'clima',text:"Qual fenômeno natural é comum no Cerrado durante a estação seca?",options:["Nevascas","Geadas constantes","Tempestades de neve","Queimadas"],correct:3,fact:'',fixed:true},
 {id:'CL10',category:'clima',text:"Quais são os três principais biomas encontrados na região Centro-Oeste?",options:["Caatinga, Pampa e Mata Atlântica","Cerrado, Pantanal e Amazônia","Pampa, Cerrado e Caatinga","Amazônia, Pampa e Caatinga"],correct:1,fact:'',fixed:true},
  {id:'G01',category:'geografia',text:'Quais estados fazem parte da Região Centro-Oeste?',options:['Goiás, Mato Grosso e Mato Grosso do Sul','Paraná, Goiás e Bahia','São Paulo, Goiás e Pará','Mato Grosso, Tocantins e Minas Gerais'],correct:0,fact:'Além desses três estados, a região inclui o Distrito Federal.'},
  {id:'G02',category:'geografia',text:'Qual é a capital de Mato Grosso?',options:['Goiânia','Campo Grande','Cuiabá','Palmas'],correct:2,fact:'Cuiabá é a capital do estado de Mato Grosso.'},
  {id:'G03',category:'geografia',text:'Qual é a capital de Mato Grosso do Sul?',options:['Cuiabá','Campo Grande','Goiânia','Corumbá'],correct:1,fact:'Campo Grande é a capital de Mato Grosso do Sul.'},
  {id:'G04',category:'geografia',text:'Qual é a capital de Goiás?',options:['Anápolis','Goiânia','Brasília','Rio Verde'],correct:1,fact:'Goiânia é a capital de Goiás; Brasília é a capital do Brasil.'},
  {id:'C01',category:'culinaria',image:'assets/pequi.svg',text:'Qual fruto do Cerrado é muito usado no arroz típico de Goiás?',options:['Pequi','Maçã','Morango','Pêssego'],correct:0,fact:'O pequi é um fruto típico do Cerrado, presente em preparações regionais.'},
  {id:'C02',category:'culinaria',text:'O empadão goiano é um prato tradicional de qual estado?',options:['Mato Grosso','Goiás','Acre','Rio Grande do Sul'],correct:1,fact:'O empadão goiano é uma preparação tradicional de Goiás.'},
  {id:'C04',category:'culinaria',text:'A chipa, popular em Mato Grosso do Sul, é geralmente preparada com...',options:['Polvilho e queijo','Macarrão e tomate','Peixe cru','Batata e chocolate'],correct:0,fact:'A chipa tem tradição na região de fronteira e costuma levar polvilho e queijo.'},
  {id:'C05',category:'culinaria',text:'Apesar do nome, a “sopa paraguaia” tradicional é...',options:['Uma bebida gelada','Um caldo servido em tigela','Um prato assado à base de milho','Uma sobremesa de frutas'],correct:2,fact:'A sopa paraguaia é um prato salgado assado bastante conhecido em Mato Grosso do Sul.'},
  {id:'T01',category:'costumes',text:'A catira é uma manifestação cultural marcada principalmente por...',options:['Sapateado e palmas','Dança com leques','Roda de capoeira','Música instrumental sem dança'],correct:0,fact:'A catira usa movimentos dos pés e palmas, frequentemente ao som da viola.'},
  {id:'T02',category:'costumes',text:'Qual instrumento é muito associado à música caipira e à catira?',options:['Harpa celta','Viola caipira','Gaita de foles','Saxofone'],correct:1,fact:'A viola caipira acompanha muitas manifestações musicais da região.'},
  {id:'T03',category:'costumes',image:'assets/cavalhadas.svg',text:'As Cavalhadas de Pirenópolis são uma tradição cultural de qual estado?',options:['Goiás','Mato Grosso do Sul','Mato Grosso','Distrito Federal'],correct:0,fact:'As Cavalhadas de Pirenópolis são uma celebração tradicional em Goiás.'},
  {id:'T04',category:'costumes',text:'Compartilhar uma roda de tereré é um costume muito presente em...',options:['Mato Grosso do Sul','Pará','Maranhão','Pernambuco'],correct:0,fact:'O tereré integra o convívio social em Mato Grosso do Sul.'},
  {id:'V01',category:'vestimentas',image:'assets/pantaneiro.svg',text:'Qual acessório ajuda a proteger do sol os trabalhadores rurais do Pantanal?',options:['Chapéu de abas largas','Chapéu de festa junina de palha fina','Boné de ciclista','Capuz de tecido leve'],correct:0,fact:'Chapéus de abas largas são úteis no trabalho ao ar livre no Pantanal.'},
  {id:'V02',category:'vestimentas',text:'Em atividades rurais pantaneiras, as botas são usadas principalmente para...',options:['Proteger os pés','Ajudar na navegação','Identificar a região de origem','Substituir as esporas'],correct:0,fact:'As botas oferecem proteção aos pés durante as atividades no campo.'},
  {id:'V03',category:'vestimentas',text:'Por que calças compridas são comuns no trabalho a cavalo?',options:['Ajudam a proteger as pernas','São exclusivas para festas','Impedem o uso de botas','Servem para identificar a cidade'],correct:0,fact:'Calças compridas podem ajudar na proteção das pernas durante cavalgadas.'},
  {id:'V04',category:'vestimentas',text:'Nas Cavalhadas de Pirenópolis, os participantes a cavalo usam...',options:['Trajes elaborados que representam cavaleiros','Trajes típicos de dança de salão','Roupas de pescadores','Uniformes de bandas marciais'],correct:0,fact:'As Cavalhadas apresentam cavaleiros com trajes cerimoniais e ornamentados.'},
  {id:'P01',category:'pantanal',image:'assets/pantanal.svg',text:'Qual característica natural torna o Pantanal tão especial?',options:['É um deserto sem rios','Possui planícies que alagam em parte do ano','É coberto por neve no inverno','É formado apenas por montanhas altas'],correct:1,fact:'O Pantanal é uma extensa planície com ciclos naturais de cheia e seca.'},
  {id:'P02',category:'pantanal',text:'Qual felino é encontrado no Pantanal e é importante para o equilíbrio da fauna?',options:['Onça-pintada','Leopardo-das-neves','Tigre-de-bengala','Leão-africano'],correct:0,fact:'A onça-pintada é um grande predador nativo do Pantanal e ajuda a manter o equilíbrio ecológico.'},
  {id:'P03',category:'pantanal',text:'Qual dessas aves pode ser encontrada no Pantanal e se destaca pela plumagem azul?',options:['Pinguim-imperador','Arara-azul','Avestruz','Gaivota-ártica'],correct:1,fact:'A arara-azul-grande é uma ave marcante da fauna pantaneira.'},
  {id:'P04',category:'pantanal',text:'Qual rio é fundamental para o sistema de águas do Pantanal?',options:['Rio Tietê','Rio São Francisco','Rio Paraguai','Rio Doce'],correct:2,fact:'O rio Paraguai e seus afluentes são essenciais para o ciclo de cheias da planície pantaneira.'},
];

export function validateBank(bank=questions){
 if(bank.length!==30)throw new Error('O banco-base deve ter 30 perguntas.');
 const ids=new Set();
 for(const cat of categories){
  const required=cat.id==='clima'?10:4;
  if(bank.filter(q=>q.category===cat.id).length!==required)throw new Error('Quantidade incorreta no tema '+cat.label);
 }
 for(const q of bank){
  if(ids.has(q.id))throw new Error('ID duplicado '+q.id);ids.add(q.id);
  if(!q.text?.trim()||!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4||!Number.isInteger(q.correct)||q.correct<0||q.correct>3)throw new Error('Pergunta inválida '+q.id);
  if(q.category==='clima'&&(!isFixedClimateQuestion(q)||q.fixed!==true))throw new Error('Questão de Clima sem proteção');
 }
 return true;
}
export function shuffle(input,rng=Math.random){
 const copy=[...input];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy;
}
function withAnswers(q,rng){return {...q,answers:shuffle(q.options.map((text,original)=>({id:q.id+'-'+original,text,correct:original===q.correct})),rng)}}
export function makeSession(bank=questions,rng=Math.random){
 const cats=[categories[0],...shuffle(categories.slice(1),rng).slice(0,4)];
 return shuffle(cats.map(cat=>{
  const group=bank.filter(q=>q.category===cat.id);
  if(!group.length)throw new Error('Sem perguntas no tema '+cat.label);
  return withAnswers(group[Math.floor(rng()*group.length)],rng);
 }),rng);
}
validateBank();
export function makeFlexibleSession(bank,rng=Math.random){
 const eligible=bank.filter(q=>q.active!==false&&q.options?.length===4&&q.text?.trim());
 if(eligible.length<5)throw new Error('O banco precisa de pelo menos cinco perguntas ativas.');
 const chosen=[],climate=eligible.filter(q=>isFixedClimateQuestion(q));
 if(climate.length)chosen.push(climate[Math.floor(rng()*climate.length)]);
 const groups=new Map();
 for(const q of eligible){
  if(isFixedClimateQuestion(q))continue;
  const key=q.topicId||q.category||'sem-topico';
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(q);
 }
 for(const group of shuffle([...groups.values()],rng)){
  if(chosen.length===5)break;chosen.push(group[Math.floor(rng()*group.length)]);
 }
 const ids=new Set(chosen.map(q=>q.id));
 for(const q of shuffle(eligible.filter(q=>!ids.has(q.id)),rng)){if(chosen.length===5)break;chosen.push(q)}
 return shuffle(chosen.map(q=>withAnswers(q,rng)),rng);
}
